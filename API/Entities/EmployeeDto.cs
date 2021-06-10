using System;

namespace API.Entities
{
    public class EmployeeDto
    {
        public string Id { get; set; }
        public string IdentityNo { get; set; }
        public string FullName { get; set; }
        public bool IsEvaluated { get; set; }
        public DateTime? LastEvauationDate { get; set; }
    }
}