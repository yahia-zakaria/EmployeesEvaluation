using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public string IdentityNo { get; set; }
        public string FullName { get; set; }
        public bool IsEvaluated { get; set; } = false;
        public DateTime? LastEvauationDate { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}