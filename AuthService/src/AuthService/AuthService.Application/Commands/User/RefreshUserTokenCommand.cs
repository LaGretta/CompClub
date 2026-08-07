using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.Application.Commands.User;

public class RefreshUserTokenCommand
{
    public string? UserAgent { get; set; }
    public string?  IpAddress { get; set; }
    //
    public required HttpCookiesDataset HttpCookies { get; set; } = new();
}