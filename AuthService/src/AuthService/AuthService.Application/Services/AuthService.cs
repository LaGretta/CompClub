using AuthService.Application.Commands.User;
using AuthService.Application.Commands.User.Avatar;
using AuthService.Application.Responses.Avatar;
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
using AuthService.Domain.Models.Extensions;
using AuthService.Shared.Hash;
using AuthService.Storage;
using AuthService.Storage.Repositories.Abstractions;
using Microsoft.Extensions.Options;


namespace AuthService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IJwtService _jwtService;
    private readonly IUserAvatarStorage _userAvatarStorage;

    private readonly IRefreshTokenService _refreshTokenService;

    //
    private readonly IUnitOfWork _unitOfWork;

    //options
    private readonly SessionOptions _options;

    //constructor
    public AuthService(IAuthRepository authRepository, IJwtService jwtService, IRefreshTokenService refreshTokenService, IUserAvatarStorage userAvatarStorage,
        IUnitOfWork unitOfWork, IOptions<SessionOptions> options)
    {
        _authRepository = authRepository;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
        _userAvatarStorage = userAvatarStorage;
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
        var clientRole = (await _authRepository.Roles.FirstOrDefaultAsync(
            new() { Predicate = r => r.Name == "Client" },
            new() { Tracking = QueryTracking.NoTracking, IgnoreQueryFilters = false },
            cancellationToken)) ?? throw new DataExistenceException("Roles", "r => r.Name == \"Client\"");
        var userId = Guid.NewGuid();
        string accessToken = _jwtService.GenerateToken(new()
        {
            UserId = userId,
            UserName = request.Name,
            Email = request.Email,
            RoleNames = [clientRole.Name]
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
        //
        await _authRepository.UserRoles.AddAsync(
            new UserRole { UserId = userId, RoleId = clientRole.Id }, cancellationToken);
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
            UserId = user.Id,
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
        var roleIds = (await _authRepository.UserRoles.GetAsync(
            new() { Predicate = r => r.UserId == user.Id },
            new() { Tracking = QueryTracking.NoTracking },
            cancellationToken)).Select(x => x.RoleId).ToList();
        var roleNames = (await _authRepository.Roles.GetAsync(
            new() { Predicate = r => roleIds.Contains(r.Id) },
            new() { Tracking = QueryTracking.NoTracking },
            cancellationToken)).Select(r => r.Name).ToList();
        string accessToken = _jwtService.GenerateToken(new()
        {
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            RoleNames = roleNames,
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
        //time recording
        var dateNow = DateTime.UtcNow;
        var expiresAt = dateNow + _options.Lifetime;
        //session finding and checking(EnsureAvailable)
        var oldHashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var session = (await _authRepository.Sessions.FirstOrDefaultAsync(new()
        {
            Predicate = s => s.TokenHash == oldHashedRefreshToken,
        }, new() { Tracking = QueryTracking.NoTracking }, cancellationToken)).EnsureAvailable(dateNow);
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
        var roleIds = (await _authRepository.UserRoles.GetAsync(
            new() { Predicate = r => r.UserId == user.Id },
            new() { Tracking = QueryTracking.NoTracking },
            cancellationToken)).Select(x => x.RoleId).ToList();
        var roleNames = (await _authRepository.Roles.GetAsync(
            new() { Predicate = r => roleIds.Contains(r.Id) },
            new() { Tracking = QueryTracking.NoTracking },
            cancellationToken)).Select(r => r.Name).ToList();
        string accessToken = _jwtService.GenerateToken(new()
        {
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            RoleNames = roleNames,
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
        //time recording
        var dateNow = DateTime.UtcNow;
        //session finding and checking(EnsureAvailable)
        var oldHashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var currentSession = (await _authRepository.Sessions.FirstOrDefaultAsync(new()
        {
            Predicate = s => s.TokenHash == oldHashedRefreshToken,
        }, new() { Tracking = QueryTracking.NoTracking },cancellationToken)).EnsureAvailable(dateNow);
        //user checking
        if (!await _authRepository.Users.AnyAsync(new()
            {
                Predicate = u => u.Sessions.Any(s => s.Id == currentSession.Id && s.UserId == u.Id),
            }, false, cancellationToken))
            throw new UserSoftDeletedException(currentSession.UserId, currentSession.Id);
        //branching: delete this or the specified session
        Session? sessionForDelete;
        if (request.SessionIdToDelete != null && request.SessionIdToDelete != currentSession.Id)
        {
            //session for deleting checking(EnsureAvailable)
            sessionForDelete = (await _authRepository.Sessions.FirstOrDefaultAsync(new()
            {
                Predicate = s=> s.UserId == currentSession.UserId,
            }, new() { Tracking = QueryTracking.NoTracking },cancellationToken)).EnsureAvailable(dateNow);
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
    //Avatars management
    public async Task UploadAvatar(UploadAvatarCommand request, CancellationToken cancellationToken)
    {
        //cookies data check
        if (request.HttpCookies.RefreshToken == null)
            throw new IncompleteHttpCookieDatasetException(["refreshToken"]);
        //Session finding and checking(EnsureAvailable)
        var hashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var currentSession = (await _authRepository.Sessions.FirstOrDefaultAsync(new()
        {
            Predicate = s => s.TokenHash == hashedRefreshToken,
        }, new() { Tracking = QueryTracking.NoTracking },cancellationToken)).EnsureAvailable();
        //UserId 
        var userId =  currentSession.UserId;
        //
        await _userAvatarStorage.UploadAsync(userId, request.File);
    }
    public async Task<GetAvatarPresignedUrlResponse> GetAvatarPresignedUrl(GetAvatarPresignedUrlCommand request, CancellationToken cancellationToken)
    {
        //cookies data check
        if (request.HttpCookies.RefreshToken == null)
            throw new IncompleteHttpCookieDatasetException(["refreshToken"]);
        //Session finding and checking(EnsureAvailable)
        var hashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var currentSession = (await _authRepository.Sessions.FirstOrDefaultAsync(new()
        {
            Predicate = s => s.TokenHash == hashedRefreshToken,
        }, new() { Tracking = QueryTracking.NoTracking },cancellationToken)).EnsureAvailable();
        //UserId 
        var userId =  currentSession.UserId;
        //
        return new GetAvatarPresignedUrlResponse()
        {
            PresignedUrl = _userAvatarStorage.GetPresignedUrl(userId)
        };
    }
    public async Task DeleteAvatar(DeleteAvatarCommand request, CancellationToken cancellationToken)
    {
        //cookies data check
        if (request.HttpCookies.RefreshToken == null)
            throw new IncompleteHttpCookieDatasetException(["refreshToken"]);
        //Session finding and checking(EnsureAvailable)
        var hashedRefreshToken = HasherUtil.Hash(request.HttpCookies.RefreshToken);
        var currentSession = (await _authRepository.Sessions.FirstOrDefaultAsync(new()
        {
            Predicate = s => s.TokenHash == hashedRefreshToken,
        }, new() { Tracking = QueryTracking.NoTracking },cancellationToken)).EnsureAvailable();
        //UserId 
        var userId =  currentSession.UserId;
        //
        await _userAvatarStorage.DeleteAsync(userId);
    }
    
}