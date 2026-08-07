using AuthService.Application.Commands.User;
using AuthService.Application.Results.Auth;
using AuthService.Application.Results.Auth.Base;
using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Cookies;
using AuthService.Domain.DTOs.Options;
using AuthService.Domain.Enums.Exceptions.Auth;
using AuthService.Domain.Enums.Queries;
using AuthService.Domain.Exceptions.Auth;
using AuthService.Domain.Exceptions.DataBase;
using AuthService.Domain.Exceptions.Services;
using AuthService.Domain.Models;
using AuthService.Shared.Hash;
using AuthService.Storage;
using AuthService.Storage.Repositories.Abstractions;
using Microsoft.Extensions.Options;


namespace AuthService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IJwtService _jwtService;

    private readonly IRefreshTokenService _refreshTokenService;

    //
    private readonly IUnitOfWork _unitOfWork;

    //options
    private readonly SessionOptions _options;

    //constructor
    public AuthService(IAuthRepository authRepository, IJwtService jwtService, IRefreshTokenService refreshTokenService,
        IUnitOfWork unitOfWork, IOptions<SessionOptions> options)
    {
        _authRepository = authRepository;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
        _unitOfWork = unitOfWork;
        //
        _options = options.Value;
    }

    //methods
    public async Task<AuthResult<RegisterUserResult>> Register(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        //user finding and checking
        if (await _authRepository.Users.AnyAsync(
                new() { Predicate = u => u.Email == request.Email },
                false,
                cancellationToken))
            throw new UserAlreadyExistsException(request.Email);
        //access token creating
        var clientRoleId = (await _authRepository.Roles.FirstOrDefaultAsync(
            new() { Predicate = r => r.Name == "Client" },
            new() { Tracking = QueryTracking.NoTracking, IgnoreQueryFilters = false },
            cancellationToken))?.Id ?? throw new DataExistenceException("Roles", "r => r.Name == \"Client\"");
        var userId = Guid.NewGuid();
        string accessToken = _jwtService.GenerateToken(new()
        {
            UserId = userId,
            UserName = request.Name,
            Email = request.Email,
            RoleIds = [clientRoleId]
        });
        //time recording
        var dateNow = DateTime.UtcNow;
        var expiresAt = dateNow + _options.Lifetime;
        //session creating
        string refreshToken = _refreshTokenService.GenerateToken();
        string hashedRefreshToken = HasherUtil.Hash(refreshToken);
        var newSession = new Session
        {
            UserAgent = request.UserAgent,
            TokenHash = hashedRefreshToken,
            IpAddress = request.IpAddress,
            ExpiresAt = expiresAt,
            LastUsedAt = dateNow,
        };
        var newUser = new User
        {
            Id = userId,
            Email = request.Email,
            PasswordHash = HasherUtil.Hash(request.Password),
            UserName = request.Email,
        };
        //models attaching
        newSession.User = newUser;
        newUser.Sessions.Add(newSession);
        await _authRepository.Users.AddAsync(newUser, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        //return-data creating and returning
        return new()
        {
            Data = new()
                {
                    AccessToken = accessToken
                },
            Cookies =
            [
                new AppendCookieCommand
                {
                    Name = "refreshToken",
                    Value = refreshToken,
                    ExpiresAt = expiresAt
                }
            ]
        };
    }

    //
    public async Task<AuthResult<LoginUserResult>> Login(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _authRepository.Users.FirstOrDefaultAsync(
            new()
            {
                Predicate = request.Login.Contains('@')
                    ? u => u.Email == request.Login
                    : u => u.UserName == request.Login
            },
            new() { Tracking = QueryTracking.NoTracking, IgnoreQueryFilters = false },
            cancellationToken);

        if (user == null || !HasherUtil.Verify(request.Password, user.PasswordHash))
            throw new UserPasswordOrEmailInvalidException();
        //time recording
        var dateNow = DateTime.UtcNow;
        var expiresAt = dateNow + _options.Lifetime;
        //session creating
        string refreshToken = _refreshTokenService.GenerateToken();
        string hashedRefreshToken = HasherUtil.Hash(refreshToken);
        var newSession = new Session()
        {
            UserAgent = request.UserAgent,
            TokenHash = hashedRefreshToken,
            IpAddress = request.IpAddress,
            ExpiresAt = expiresAt,
            LastUsedAt = dateNow
        };
        //session attaching
        await _authRepository.Sessions.AddAsync(newSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        //access token creating
        var userRoles = (await _authRepository.UserRoles.GetAsync(
            new() { Predicate = r => r.UserId == user.Id },
            new() { Tracking = QueryTracking.NoTracking },
            cancellationToken)).Select(x => x.RoleId).ToList();
        string accessToken = _jwtService.GenerateToken(new()
        {
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            RoleIds = userRoles,
        });
        //return-data creating and returning
        return new()
        {
            Data =new(){
                AccessToken = accessToken
            },
            Cookies =
            [
                new AppendCookieCommand()
                {
                    Name = "refreshToken",
                    Value = refreshToken,
                    ExpiresAt = expiresAt
                }
            ]
        };
    }

    public async Task<AuthResult<RefreshTokenResult>> RefreshToken(RefreshUserTokenCommand request,
        CancellationToken cancellationToken)
    {
        //cookies data check
        if (request.HttpCookies.RefreshToken == null)
            throw new IncompleteHttpCookieDatasetException(["refreshToken"]);
        //session finding
        var oldHashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var session = await _authRepository.Sessions.FirstOrDefaultAsync(new()
        {
            Predicate = s => s.TokenHash == oldHashedRefreshToken,
        }, new() { Tracking = QueryTracking.NoTracking }, cancellationToken);
        //time recording
        var dateNow = DateTime.UtcNow;
        var expiresAt = dateNow + _options.Lifetime;
        //session checking
        if (session == null)
            throw new SessionValidationException(null, SessionUnavailableReason.NotFound);
        if (session.TokenHash != oldHashedRefreshToken)
            throw new SessionValidationException(session.Id, SessionUnavailableReason.TokenMismatch);
        if (session.RevokedAt != null)
            throw new SessionValidationException(session.Id, SessionUnavailableReason.Revoked);
        if (session.ExpiresAt <= dateNow)
            throw new SessionValidationException(session.Id, SessionUnavailableReason.Expired);
        //user checking
        var user = await _authRepository.Users.FirstOrDefaultAsync(new()
                   {
                       Predicate = u => u.Sessions.Any(s => s.Id == session.Id && s.UserId == u.Id),
                   }, new() { Tracking = QueryTracking.NoTracking }, cancellationToken) ??
                   throw new UserSoftDeletedException(session.UserId, session.Id);
        //session updating
        string refreshToken = _refreshTokenService.GenerateToken();
        string hashedRefreshToken = HasherUtil.Hash(refreshToken);

        session.UserAgent = request.UserAgent;
        session.IpAddress = request.IpAddress;
        session.LastUsedAt = dateNow;
        session.TokenHash = hashedRefreshToken;

        _authRepository.Sessions.Update(session);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        //access token creating
        var userRoles = (await _authRepository.UserRoles.GetAsync(
            new() { Predicate = r => r.UserId == user.Id },
            new() { Tracking = QueryTracking.NoTracking },
            cancellationToken)).Select(x => x.RoleId).ToList();
        string accessToken = _jwtService.GenerateToken(new()
        {
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            RoleIds = userRoles,
        });
        //return-data creating and returning
        return new()
        {
            Data =new (){
                AccessToken = accessToken
            },
            Cookies =
            [
                new AppendCookieCommand()
                {
                    Name = "refreshToken",
                    Value = refreshToken,
                    ExpiresAt = expiresAt
                }
            ]
        };
    }

    public async Task<AuthResult<LogoutUserResult>> Logout(LogoutUserCommand request, CancellationToken cancellationToken)
    {
        //cookies data check
        if (request.HttpCookies.RefreshToken == null)
            throw new IncompleteHttpCookieDatasetException(["refreshToken"]);
        //session finding
        var oldHashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var currentSession = await _authRepository.Sessions.FirstOrDefaultAsync(new()
            {
                Predicate = s => s.TokenHash == oldHashedRefreshToken,
            }, new() { Tracking = QueryTracking.NoTracking },cancellationToken);
        //time recording
        var dateNow = DateTime.UtcNow;
        //session checking
        if (currentSession == null)
            throw new SessionValidationException(null, SessionUnavailableReason.NotFound);
        if (currentSession.RevokedAt != null)
            throw new SessionValidationException(currentSession.Id, SessionUnavailableReason.Revoked);
        if (currentSession.ExpiresAt <= dateNow)
            throw new SessionValidationException(currentSession.Id, SessionUnavailableReason.Expired);
        //user checking
        if (!await _authRepository.Users.AnyAsync(new()
            {
                Predicate = u => u.Sessions.Any(s => s.Id == currentSession.Id && s.UserId == u.Id),
            }, true, cancellationToken))
            throw new UserSoftDeletedException(currentSession.UserId, currentSession.Id);
        //branching: delete this or the specified session
        Session? sessionForDelete;
        if (request.SessionIdToDelete != null && request.SessionIdToDelete != currentSession.Id)
        {
            sessionForDelete = await _authRepository.Sessions.FirstOrDefaultAsync(new()
            {
                Predicate = s=> s.UserId == currentSession.UserId,
            }, new() { Tracking = QueryTracking.NoTracking },cancellationToken);
            //session for deleting checking
            if (sessionForDelete == null)
                throw new SessionValidationException(null, SessionUnavailableReason.NotFound);
            if (sessionForDelete.RevokedAt != null)
                throw new SessionValidationException(sessionForDelete.Id, SessionUnavailableReason.Revoked);
            if (sessionForDelete.ExpiresAt <= dateNow)
                throw new SessionValidationException(sessionForDelete.Id, SessionUnavailableReason.Expired);
        }
        else sessionForDelete = currentSession;

        //session changing and revoking
        sessionForDelete.LastUsedAt = dateNow;
        sessionForDelete.RevokedAt = dateNow;
        //session update and soft-deleting
        _authRepository.Sessions.Update(sessionForDelete);
        _authRepository.Sessions.Remove(sessionForDelete);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        //return-data creating and returning
        return new()
        {
            Data = new(),
            Cookies = [new DeleteCookieCommand() { Name = "refreshToken" }]
        };
    }
}