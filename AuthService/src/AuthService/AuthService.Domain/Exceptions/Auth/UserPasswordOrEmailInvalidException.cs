namespace AuthService.Domain.Exceptions.Auth;

public class UserPasswordOrEmailInvalidException: Exception
{
    public UserPasswordOrEmailInvalidException() : base($"Invalid login or password")
    {
    }
}