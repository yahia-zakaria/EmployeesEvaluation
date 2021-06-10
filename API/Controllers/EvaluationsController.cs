using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Policy = "AllLevels")]
    public class EvaluationsController : ApiBaseController
    {
        private readonly IUnitOfWork uow;
        private readonly DataContext _context;
        public EvaluationsController(IUnitOfWork unitOfWork, DataContext context)
        {
            _context = context;
            uow = unitOfWork;
        }
        [HttpPost("evaluate-employee")]
        public async Task<ActionResult> EvaluateEmployee(Evaluation model)
        {
            model.EvaluatedBy = User.GetUserId();
            model.EvaluatedAt = DateTime.Now;
            await uow.EvaluationRepository.EvauateEmployee(model);
            var user = await _context.Users.FindAsync(model.EmployeeId);
            user.LastEvauationDate = model.EvaluatedAt;
            user.IsEvaluated = true;
            await _context.SaveChangesAsync();
            await uow.SaveAsync();
            return Ok();
        }
        [HttpPost("employees")]
        public async Task<ActionResult<List<EmployeeDto>>> GetEmployees([FromBody] PaginRequest paging)
        {
            return Ok(await uow.EvaluationRepository.GetEmployees(paging));
        }
        [Authorize(Policy = "AllLevels")]
        [HttpGet("employee/{id}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployee(string id)
        {
            return Ok(await uow.EvaluationRepository.GetEmployee(id));
        }
        [Authorize(Policy = "AllLevels")]
        [HttpGet("employee-evaluation/{id}")]
        public async Task<ActionResult<Evaluation>> GetEmployeeEvaluation(string id)
        {
            return Ok(await uow.EvaluationRepository.GetEmployeeEvaluation(id));
        }

        [HttpGet("evaluation-report")]
        public async Task<ActionResult<EvaluationReportDto>> GetEvaluationReport(string id)
        {
            return Ok(await uow.EvaluationRepository.GetEvaluationReport());
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardDto>> GetDashboard(string id)
        {
            return Ok(await uow.EvaluationRepository.GetDashboard());
        }
    }
}