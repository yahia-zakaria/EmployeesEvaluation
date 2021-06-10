using System;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
   [Authorize(Policy = "HasAdminRole")]
    public class AccountController : ApiBaseController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _config;
        public AccountController(IConfiguration config,
                                 UserManager<User> userManager,
                                 RoleManager<Role> roleManager,
                                 SignInManager<User> signInManager,
                                 ITokenService tokenService,
                                 IMapper mapper)
        {
            this._config = config;
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._signInManager = signInManager;
            _mapper = mapper;
            _tokenService = tokenService;

        }

        [HttpPost("register")]
        public async Task<ActionResult<SuccessedLoginDto>> Register(RegisterDto model)
        {
            if (await IsRegistered(model.Email, model.IdentityNo))
                return BadRequest("المستخدم مسجل مسبقا");

            var user = _mapper.Map<User>(model);
            user.UserName = model.Email;
            var userResult = await _userManager.CreateAsync(user, _config["DefaultPassword"].ToString());
            if (!userResult.Succeeded) return BadRequest(userResult.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Employee");
            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new SuccessedLoginDto
            {
                Id = user.Id,
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber
            };
        }
        [HttpPut("update-user")]
        public async Task<ActionResult> UpdateUser(UserEditDto model)
        {
            if (string.IsNullOrEmpty(model.PhoneNumber) || string.IsNullOrEmpty(model.FullName))
                return BadRequest("الرجاء التأكد من إدخال بيانات صحيحة");
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) return NotFound("المستخدم المراد تعديله غير موجود");

            user.PhoneNumber = model.PhoneNumber;
            user.FullName = model.FullName;
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) return NoContent();
            return BadRequest("حدث خطأ أثناء تعديل المستخدم");
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessedLoginDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) return Unauthorized("اسم المستخدم غير صالح");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized();
                // await _signInManager.SignInAsync(user,false);
            return new SuccessedLoginDto
            {
                Id = user.Id,
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber
            };
        }
        [HttpPost("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles([FromBody] PaginRequest paging)
        {
            var query = _userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(u => u.Role)
            .Select(u => new UsersWithRolesDto
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                PhoneNumber = u.PhoneNumber,
                Locked = (u.LockoutEnd != null && u.LockoutEnd > DateTime.Now),
                Roles = u.UserRoles.Select(u => u.Role.Name).ToList()
            }).AsQueryable();

            var pagingResponse = new PagingResponse<UsersWithRolesDto>()
            {
                Draw = paging.draw
            };
            var recordsTotal = await query.CountAsync();
            var searchValue = paging.search.value;
            if (!string.IsNullOrEmpty(paging.search.value))
            {
                query = query.Where(u => u.PhoneNumber.Contains(searchValue) || u.FullName.Contains(searchValue) || u.UserName.Contains(searchValue));
            }



            var colOrder = paging.order[0];

            switch (colOrder.column)
            {
                case 0:
                    query = colOrder.dir == "asc" ? query.OrderBy(u => u.Id) : query.OrderByDescending(o => o.Id);
                    break;
                case 1:
                    query = colOrder.dir == "asc" ? query.OrderBy(u => u.FullName) : query.OrderByDescending(o => o.FullName);
                    break;
                case 2:
                    query = colOrder.dir == "asc" ? query.OrderBy(u => u.PhoneNumber) : query.OrderByDescending(o => o.PhoneNumber);
                    break;
            }

            var recordsFiltered = query.Count();

            pagingResponse.Data = await query.Skip(paging.start).Take(paging.length).ToListAsync();
            pagingResponse.RecordsTotal = recordsTotal;
            pagingResponse.RecordsFiltered = recordsTotal;


            return Ok(pagingResponse);
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("لا يوجد مستخدم بهذا الاسم");
            var selectedRoles = roles.Split(',').ToArray();
            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in selectedRoles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                    await _roleManager.CreateAsync(new Role { Name = role });
            }
            var addingResult = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!addingResult.Succeeded)
                return BadRequest("غير قادر على اضافة الصلاحية");
            var removingOldRoles = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!removingOldRoles.Succeeded)
                return BadRequest("خطأ أثناء إضافة الصلاحية");
            return Ok(await _userManager.GetRolesAsync(user));
        }

        [HttpPut("activate/{username}")]
        public async Task<ActionResult> Activate(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("لا يوجد مستخدم بهذا الاسم");
            //check status:enabled or disabled
            if (user.LockoutEnd != null && user.LockoutEnd > DateTime.Now)//locked
                user.LockoutEnd = DateTime.Now;//unlock
            else
            {
                var newDate = user.LockoutEnd = DateTime.Now.AddYears(200);
                user.LockoutEnd = newDate;
            }
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) return NoContent();

            return BadRequest("خطأ أثناء تحديث بيانات المستخدم");

        }
        [HttpPut("reset-password/{username}")]
        public async Task<ActionResult> ResetPassword(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("لا يوجد مستخدم بهذا الاسم");

            var _token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, _token, _config["DefaultPassword"]);
            if (result.Succeeded) return Ok();
            return BadRequest("خطأ أثناء تحديث بيانات المستخدم");
        }

        [HttpPost("change-password/{newPassword}")]
        [Authorize(Policy = "AllLevels")]
        public async Task<ActionResult> ChangePass(string newPassword)
        {
            if (string.IsNullOrEmpty(newPassword))
                return BadRequest("الرجاء إدخال كلمة السر أولا");

            var user = await _userManager.FindByNameAsync(User.GetUsername());
            if (user == null) return NotFound("لا يوجد مستخدم بهذا الاسم");
            string _token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, _token, newPassword);
            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest("خطأ أثناء تحديث بيانات المستخدم");
        }
        [HttpGet("{username}")]
        public async Task<ActionResult<UserEditDto>> GetUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            var userDto = _mapper.Map<UserEditDto>(user);
            // var userToReturn = _mapper.Map<MemberDto>(user);
            return Ok(userDto);
        }


        private async Task<bool> IsRegistered(string email, string identityNo)
        {
            var result = await _userManager.Users.AnyAsync(u => u.Email == email || u.IdentityNo == identityNo);
            return result;
        }
    }
}