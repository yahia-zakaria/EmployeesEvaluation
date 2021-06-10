using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class CriterionRepository : ICriterionRepository
    {
        private readonly DataContext _context;
        public CriterionRepository(DataContext context)
        {
            _context = context;
        }

        public IQueryable<Criterion> GetGoalsAsQueryable()
        {
            return _context.Criteria.AsQueryable();
        }

        public async Task<List<Criterion>> GetGoals()
        {
            return await _context.Criteria.OrderBy(a=>a.Id).ToListAsync();
        }
        public async Task<Criterion> GetGoal(int id)
        {
            return await _context.Criteria.FindAsync(id);
        }
        public void AddGoal(Criterion goal)
        {
            _context.Criteria.Add(goal);
        }
        public void UpdateGoal(Criterion goal)
        {
            _context.Attach<Criterion>(goal);
            _context.Entry(goal).State = EntityState.Modified;
        }

        public async Task AddRangeOfGoals(List<Criterion> goal)
        {
            await  _context.Criteria.AddRangeAsync(goal);
        }
    }
}