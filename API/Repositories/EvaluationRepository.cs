using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DAL;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace API.Repositories
{
    public class EvaluationRepository : IEvaluationRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IDapper _dapper;
        private string get_dashboard_grades = @"select ""Grade"", floor((COUNT(""Grade"")/ :cnt)*100) as Rate from public.""Evaluations""  group by ""Grade""";
        private string getEvaluationReport = @"select u.""Id"", ""FullName"", ""IdentityNo"", ""Grade"", ""EvaluatedAt""
from public.""Evaluations""  e JOIN public.""AspNetUsers"" u
on e.""EmployeeId"" = u.""Id""
order by case
when ""Grade""  like N'%ممتاز%' then 1
when ""Grade""  like N'%جيد جدا%' then 2
when ""Grade"" like N'%جيد%' then 3
when ""Grade"" like N'%مرضي%' then 4 
when ""Grade"" like N'%غير مرضي%' then 5
end
";


        public EvaluationRepository(DataContext context, IMapper mapper,
        IDapper dapper)
        {
            _context = context;
            _mapper = mapper;
            _dapper = dapper;
        }
        public async Task EvauateEmployee(Evaluation evaluations)
        {
            var previousEval = await _context.Evaluations.Include(a=>a.EmployeeScore).Where(a=>a.EmployeeId==evaluations.EmployeeId).ToListAsync();
           foreach (var item in previousEval)
           {
               _context.Score.RemoveRange(item.EmployeeScore);
               await _context.SaveChangesAsync();
               _context.Evaluations.Remove(item);
           }
                 await _context.SaveChangesAsync();
            _context.Evaluations.AddRange(evaluations);
        }
        public async Task<PagingResponse<EmployeeDto>> GetEmployees(PaginRequest paging)
        {
            var query = _context.Users.AsQueryable();
            var pagingResponse = new PagingResponse<EmployeeDto>()
            {
                Draw = paging.draw
            };
            var recordsTotal = await query.CountAsync();
            var searchValue = paging.search.value;
            if (!string.IsNullOrEmpty(paging.search.value))
            {
                query = query.Where(u => u.IdentityNo.Contains(searchValue) || u.FullName.Contains(searchValue));
            }



            var colOrder = paging.order[0];

            switch (colOrder.column)
            {
                case 0:
                    query = colOrder.dir == "asc" ? query.OrderBy(u => u.IdentityNo) : query.OrderByDescending(o => o.IdentityNo);
                    break;
                case 1:
                    query = colOrder.dir == "asc" ? query.OrderBy(u => u.FullName) : query.OrderByDescending(o => o.FullName);
                    break;
            }

            var recordsFiltered = query.Count();

            pagingResponse.Data = _mapper.Map<List<EmployeeDto>>(await query.Skip(paging.start).Take(paging.length).ToListAsync());
            pagingResponse.RecordsTotal = recordsTotal;
            pagingResponse.RecordsFiltered = recordsTotal;


            return pagingResponse;
        }

        public async Task<EmployeeDto> GetEmployee(string id)
        {
            var user = await _context.Users.FindAsync(id);
            return _mapper.Map<EmployeeDto>(user);
        }

        public async Task<Evaluation> GetEmployeeEvaluation(string id)
        {
            var eval = await _context.Evaluations.Include(a => a.EmployeeScore)
            .Where(w => w.EmployeeId == id).OrderBy(o => o.Id).LastOrDefaultAsync();

            return eval;
        }

        public async Task<EvaluationReportDto> GetEvaluationReport()
        {
            // var repo = await Task.FromResult(_dapper.GetAll<EvaluationReport>("call getevaluationreport()", null, commandType: System.Data.CommandType.StoredProcedure));
            var repo = await _context.EvaluationReport.FromSqlRaw(getEvaluationReport).ToListAsync();
            return new EvaluationReportDto
            {
                Draw = 0,
                RecordsTotal = repo.Count(),
                RecordsFiltered = repo.Count(),
                Data = repo
            };

        
        }

        public async Task<DashboardDto> GetDashboard()
        {
          
            var gradeStatistics = await _context.GradeStatisticDto.FromSqlRaw(get_dashboard_grades, new NpgsqlParameter("cnt", Convert.ToDouble(await _context.Users.CountAsync()))).ToListAsync();
            var all = await _context.Users.CountAsync();
            var evaluated = await _context.Users.Where(u=>u.IsEvaluated).CountAsync();
            var Notevaluated=await _context.Users.Where(u=>!u.IsEvaluated).CountAsync();
            return new DashboardDto
            {
                AllEmployees = all,
                EvaluatedEmployees = evaluated,
                NotEvaluatedEmployees = Notevaluated,
                EvaluatedEmployeesRate = Math.Floor(Convert.ToDecimal(evaluated / Convert.ToDecimal(all))*100),
                NotEvaluatedEmployeesRate = Math.Floor(Convert.ToDecimal((Notevaluated) / Convert.ToDecimal(all))*100),
                GradeStatistics = gradeStatistics
            };
        }
    }
}