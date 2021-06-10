using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Data
{
    public class Seed
    {
        public static async Task AddSeedData(DataContext context, UserManager<User> userManager, RoleManager<Role> roleManager,
        IUnitOfWork uow, IConfiguration config)
        {
            if (await userManager.Users.AnyAsync())
                return;

            //get evaluation criteria json data from file
            var criteriaJsonData = System.IO.File.ReadAllText("Data/EvaluationCriteriaSeedData.json");
            var criteria = JsonSerializer.Deserialize<List<Criterion>>(criteriaJsonData);
            await uow.CriterionRepository.AddRangeOfGoals(criteria);
            await uow.SaveAsync();


            //get the users json data from file
            var usersJsonData = System.IO.File.ReadAllText("Data/userSeedData.json");
            var users = JsonSerializer.Deserialize<List<User>>(usersJsonData);

            var roles = new List<Role>(){
                new Role(){Name ="Admin"},
                new Role(){Name ="Employee"}
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role.Name))
                    await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, config["DefaultPassword"]);
                await userManager.AddToRoleAsync(user, "Employee");
            }


            var adminUser = new User()
            {
                FullName = "يحيى زكريا إدريس يعقوب",
                IdentityNo = "2468700436",
                PhoneNumber = "0545155868",
                Email = "yahiazakaria91@hotmail.com",
                UserName = "yahiazakaria91@hotmail.com"

            };

            await userManager.CreateAsync(adminUser, config["DefaultPassword"]);
            await userManager.AddToRoleAsync(adminUser, "Admin");

            var spText = System.IO.File.ReadAllText("Data/Stored Procedures/sp_GetDashboard_Grades.txt");
            await context.Database.ExecuteSqlRawAsync(spText);
            spText = System.IO.File.ReadAllText("Data/Stored Procedures/sp_GetDashboard_Employees.txt");
            await context.Database.ExecuteSqlRawAsync(spText);
            spText = System.IO.File.ReadAllText("Data/Stored Procedures/sp_GetEvaluationReport.txt");
            await context.Database.ExecuteSqlRawAsync(spText);
        }
    }
}