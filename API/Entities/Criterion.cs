using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Criterion
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "إسم الهدف مطلوب")]
        public string Name { get; set; }
        [Required(ErrorMessage = "وصف المعيار مطلوب")]
        public string Description { get; set; }
        [Required(ErrorMessage = "التقييم الكامل مطلوب")]
        public int FullScore { get; set; }
    }
}