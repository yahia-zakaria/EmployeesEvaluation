using System.Collections.Generic;

namespace API.Dtos
{
    public class UsersWithRolesDto : UserEditDto
    {
        public string Id { get; set; }
        public bool Locked { get; set; }
        public List<string> Roles { get; set; }
    }
}