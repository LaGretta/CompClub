namespace AuthService.Domain.Requests.Auth;

public class LoginUserRequest
{
    public string Login { get; set; }
    public string Password { get; set; }
}