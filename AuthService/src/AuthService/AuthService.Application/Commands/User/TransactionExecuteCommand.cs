using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.Application.Commands.User;

public class TransactionExecuteCommand
{
    public required decimal Value { get; set; }
    public required HttpCookiesDataset HttpCookies { get; set; } = new();
}