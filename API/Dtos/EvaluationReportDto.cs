using System.Collections.Generic;
using API.Entities;

namespace API.Dtos
{
    public class EvaluationReportDto
    {
        public int Draw { get; set; }
        public int RecordsTotal { get; set; }
        public int RecordsFiltered { get; set; }
        public List<EvaluationReport> Data { get; set; }
    }
}