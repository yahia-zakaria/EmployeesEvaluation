namespace API.Dtos
{
    public class SuccessedLoginDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Token { get; set; }
        public string PhoneNumber { get; set; }
    }
}