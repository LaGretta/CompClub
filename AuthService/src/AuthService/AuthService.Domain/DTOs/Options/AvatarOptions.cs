namespace AuthService.Domain.DTOs.Options;

public class AvatarOptions
{
    //Fluent validation 
    public long MaxFileSizeBytes { get; set; }
    public string[] AllowedExtensions { get; set; } = [];
    //service-level validation
    public int MaxWidth { get; set; }
    public int MaxHeight { get; set; }
    public string[] AllowedMimeTypes { get; set; } = [];
}