using System.Security.Cryptography;
using AuthService.Application.Services.Abstractions;

namespace AuthService.Application.Services;

public class RefreshTokenService: IRefreshTokenService
{
    public string GenerateToken(int bytesCount=64)
    {
        return Convert.ToBase64String(
            RandomNumberGenerator.GetBytes(bytesCount));
    }
}