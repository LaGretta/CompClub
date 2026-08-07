namespace AuthService.Application.Services.Abstractions;

public interface IRefreshTokenService
{
    string GenerateToken(int bytesCount=64);
}