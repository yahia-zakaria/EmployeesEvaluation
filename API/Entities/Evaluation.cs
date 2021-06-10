using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using API.Dtos;

namespace API.Entities
{
    public class Evaluation
    {
        public int Id { get; set; }
        public string Grade { get; set; }
        public string EmployeeId { get; set; }
        [ForeignKey("User")]
        public string EvaluatedBy { get; set; }
        public DateTime EvaluatedAt { get; set; } = DateTime.Now;
        public List<Score> EmployeeScore { get; set; }
    }
}