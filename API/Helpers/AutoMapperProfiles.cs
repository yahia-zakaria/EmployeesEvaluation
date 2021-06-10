using API.Dtos;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, SuccessedLoginDto>();
            CreateMap<RegisterDto, User>();
            CreateMap<User, UserEditDto>();
            CreateMap<User, EmployeeDto>();
        }
    }
}