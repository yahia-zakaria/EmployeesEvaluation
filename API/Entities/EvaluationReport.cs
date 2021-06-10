using System;

namespace API.Entities
{
    public class EvaluationReport
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string IdentityNo { get; set; }
        public string Grade { get; set; }
        public DateTime EvaluatedAt { get; set; }
    }
}