using API.Entities;

namespace API.Dtos
{
    public class Score
    {
        public int Id { get; set; }
        public int CriterionId { get; set; }
        public int ScoreValue { get; set; }
        public Criterion Criterion { get; set; }
    }
}