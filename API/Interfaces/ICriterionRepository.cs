using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface ICriterionRepository
    {
        IQueryable<Criterion> GetGoalsAsQueryable();
        Task<List<Criterion>> GetGoals();
        Task<Criterion> GetGoal(int id);
        void AddGoal(Criterion goal);
        Task AddRangeOfGoals(List<Criterion> goal);
        void UpdateGoal(Criterion goal);
    }
}