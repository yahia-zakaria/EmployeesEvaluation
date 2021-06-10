using System.Threading.Tasks;
using API.DAL;
using API.Data;
using API.Interfaces;
using AutoMapper;

namespace API.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IDapper _dapper;

        public UnitOfWork(DataContext context, IMapper mapper, IDapper dapper)
        {
            _mapper = mapper;
            _dapper = dapper;
            _context = context;

        }
        public ICriterionRepository CriterionRepository => new CriterionRepository(_context);
        public IEvaluationRepository EvaluationRepository => new EvaluationRepository(_context, _mapper, _dapper);

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 1;
        }
    }
}