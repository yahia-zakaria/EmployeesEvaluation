using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        ICriterionRepository CriterionRepository {get;}
        IEvaluationRepository EvaluationRepository {get;}
        Task<bool> SaveAsync();

    }
}