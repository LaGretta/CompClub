using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.Application.Commands.User.Avatar;

public class GetAvatarPresignedUrlCommand
{
    public required HttpCookiesDataset HttpCookies { get; set; } = new();
}