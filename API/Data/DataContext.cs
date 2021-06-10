using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using API.Dtos;
using API.Entities;
using API.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<User, Role, string, IdentityUserClaim<string>,
    UserRole, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DataContext([NotNullAttribute] DbContextOptions options) : base(options)
        {

        }

        public DbSet<Criterion> Criteria { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<EvaluationReport> EvaluationReport { get; set; }
        public DbSet<Score> Score { get; set; }
        [NotMapped]
        public DbSet<GradeStatisticDto> GradeStatisticDto { get; set; }
         [NotMapped]
        public DbSet<EmployeesStatisticDto> EmployeesStatisticDto { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<User>()
            .HasMany(u => u.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(u => u.UserId)
            .IsRequired();



            builder.Entity<Role>()
            .HasMany(u => u.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(u => u.RoleId)
            .IsRequired();



        }

    }
}