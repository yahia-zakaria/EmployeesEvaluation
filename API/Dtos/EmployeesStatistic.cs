using Microsoft.EntityFrameworkCore;

namespace API.Dtos
{
    [Keyless]
    public class EmployeesStatisticDto
    {
        public int AllEmployees { get; set; }
        public int EvaluatedEmployees { get; set; }
        public int NotEvaluatedEmployees { get; set; }
    }
}