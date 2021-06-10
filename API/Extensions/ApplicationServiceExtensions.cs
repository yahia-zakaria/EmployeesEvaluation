using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Helpers;
using API.Services;
using Microsoft.Extensions.Configuration;
using API.Interfaces;
using API.Repositories;
using API.DAL;
using System;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServiceExtensions(this IServiceCollection services, IConfiguration config)
        {
            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(typeof(CustomExceptionFilter));
            });
            services.AddDbContext<DataContext>(options =>
            {
                    options.UseSqlServer(config.GetConnectionString("DefaultConnection"));

            });
            services.AddScoped<ITokenService, TokenService>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IDapper, DapperOrm>();
            return services;
        }
    }
}

//    "DefaultConnection" : "Data Source=.;Initial Catalog=EmployeesEvaluation;Integrated Security=true"
