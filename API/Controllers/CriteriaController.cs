using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
     [Authorize(Policy = "AllLevels")]
    public class CriteriaController : ApiBaseController
    {
        private readonly IUnitOfWork uow;
        public CriteriaController(IUnitOfWork unitOfwork)
        {
            uow = unitOfwork;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Criterion>> GetGoal(int id)
        {
            var goal = await uow.CriterionRepository.GetGoal(id);
            
            if (goal == null)
                return BadRequest("الهدف غير موجود");

            return Ok(goal);
        }
        [HttpGet]
        public async Task<ActionResult<List<Criterion>>> GetGoals()
        {
            var goals = await uow.CriterionRepository.GetGoals();
            return Ok(goals);
        }
         [Authorize(Policy = "HasAdminRole")]
        [HttpPost("add-criterion")]
        public async Task<ActionResult> AddGoal(Criterion model)
        {
            uow.CriterionRepository.AddGoal(model);
            await uow.SaveAsync();
            return Ok(model);
        }
         [Authorize(Policy = "HasAdminRole")]
        [HttpPost("update-criterion")]
        public async Task<ActionResult> UpdateGoal(Criterion model)
        {
            uow.CriterionRepository.UpdateGoal(model);
            await uow.SaveAsync();
            return NoContent();
        }
    }
}