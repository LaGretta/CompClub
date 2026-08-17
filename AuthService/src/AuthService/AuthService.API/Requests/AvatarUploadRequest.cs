namespace AuthService.Api.Requests;

public class AvatarUploadRequest
{
    public IFormFile File { get; set; } = null!;
    
}