namespace AuthService.Domain.Exceptions.Auth;

public sealed class UserAlreadyExistsException : Exception
{
    public string Email { get; }

    public UserAlreadyExistsException(string email): base($"User with email '{email}' already exists.")
    {
        Email = email;
    }
}