using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IEvaluationRepository
    {
        Task EvauateEmployee(Evaluation evaluations);
        Task<PagingResponse<EmployeeDto>> GetEmployees(PaginRequest paging);
         Task<EmployeeDto> GetEmployee(string id);
         Task<Evaluation> GetEmployeeEvaluation(string id);
         Task<EvaluationReportDto> GetEvaluationReport();
         Task<DashboardDto> GetDashboard();
    }
}