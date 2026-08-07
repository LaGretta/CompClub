namespace AuthService.Domain.Enums.Exceptions.Auth;

public enum SessionUnavailableReason
{
    NotFound=0,
    TokenMismatch=1,
    Expired=2,
    Revoked=3
}