using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.Application.Commands.User;

public class LogoutUserCommand
{
    public Guid? SessionIdToDelete { get; set; }
    //
    public required HttpCookiesDataset HttpCookies { get; set; } = new();
}