using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.Application.Commands.User.Avatar;

public class UploadAvatarCommand
{
    public required Stream File { get; set; }
    //
    public required HttpCookiesDataset HttpCookies { get; set; } = new();
}