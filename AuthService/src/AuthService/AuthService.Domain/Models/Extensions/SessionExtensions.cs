using AuthService.Domain.Enums.Exceptions.Auth;
using AuthService.Domain.Exceptions.Auth;

namespace AuthService.Domain.Models.Extensions;

public static class SessionExtensions
{
    public static Session EnsureAvailable(this Session? session, DateTime? dateNow=null)
    {
        dateNow ??= DateTime.UtcNow;
        //
        if (session == null) throw new SessionValidationException(null, SessionUnavailableReason.NotFound);
        if (session.RevokedAt != null) throw new SessionValidationException(session.Id, SessionUnavailableReason.Revoked);
        if (session.ExpiresAt <= dateNow) throw new SessionValidationException(session.Id, SessionUnavailableReason.Expired);

        return session;
    }
}