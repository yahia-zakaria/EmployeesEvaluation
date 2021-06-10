using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "الإسم بالكامل مطلوب")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "رقم الهوية مطلوب"), RegularExpression(@"^(1|2)[0-9]{9}", ErrorMessage = "رقم الهوية غير صالح")]
        public string IdentityNo { get; set; }
        [Required, RegularExpression(@"^(05)(5|0|3|6|4|9|1|8|7|2)([0-9]{7})$", ErrorMessage = "رقم الجوال غير صالح")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "البريد الإلكتروني مطلوب"), EmailAddress(ErrorMessage = "البريد الإلكتروني غير صالح")]
        public string Email { get; set; }

    }
}