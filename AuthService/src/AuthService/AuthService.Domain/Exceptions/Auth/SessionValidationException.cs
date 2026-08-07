using AuthService.Domain.Enums.Exceptions.Auth;

namespace AuthService.Domain.Exceptions.Auth;

public class SessionValidationException: Exception
{
    public Guid? SessionId { get; }
    public SessionUnavailableReason Reason { get; }

    public  SessionValidationException(Guid? sessionId, SessionUnavailableReason reason):base($"token with  {(sessionId==null?"unknown": sessionId.ToString())} id avaliable by {reason}")
    {
        SessionId = sessionId;
        Reason = reason;
    }
}