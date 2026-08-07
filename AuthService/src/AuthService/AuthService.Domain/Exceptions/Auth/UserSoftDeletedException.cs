namespace AuthService.Domain.Exceptions.Auth;

public class UserSoftDeletedException:Exception
{
    public Guid UserId { get; }
    public Guid? SessionId { get; }

    public UserSoftDeletedException(Guid userId, Guid? sessionId) : base(
        $"The user with Id \"{userId}\" has been soft-deleted" +
        (sessionId != null ? $" and access was performed via the session with Id \"{sessionId}\")" : ""))
    {
        UserId = userId;
        SessionId = sessionId;
    }
    
}