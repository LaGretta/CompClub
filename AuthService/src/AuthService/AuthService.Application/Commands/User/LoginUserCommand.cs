using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.Application.Commands.User;

public class LoginUserCommand
{
    public required string Login { get; set; }
    public required string Password { get; set; }
    //
    public string? UserAgent { get; set; }
    public string?  IpAddress { get; set; }
    //
    public required HttpCookiesDataset HttpCookies { get; set; } = new();

}