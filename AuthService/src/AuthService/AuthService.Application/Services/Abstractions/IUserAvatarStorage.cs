namespace AuthService.Application.Services.Abstractions;

public interface IUserAvatarStorage
{
    Task UploadAsync(Guid userId, Stream stream);
    Task DeleteAsync(Guid userId);
    string GetPresignedUrl(Guid userId);
}