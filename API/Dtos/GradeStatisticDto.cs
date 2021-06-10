using Microsoft.EntityFrameworkCore;

namespace API.Dtos
{
    [Keyless]
    public class GradeStatisticDto
    {
        public string Grade { get; set; }
        public double Rate { get; set; }
    }
}