using System.Collections.Generic;

namespace API.Dtos
{
    public class DashboardDto : EmployeesStatisticDto
    {
        public decimal EvaluatedEmployeesRate { get; set; }
        public decimal NotEvaluatedEmployeesRate { get; set; }
        public List<GradeStatisticDto> GradeStatistics { get; set; }
    }
}