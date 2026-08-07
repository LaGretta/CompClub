namespace AuthService.Application.Commands.User;

public class RegisterUserCommand
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
    //
    public string? UserAgent { get; set; }
    public string?  IpAddress { get; set; }

    
}