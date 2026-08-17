namespace AuthService.Application.Services.Abstractions;

public interface IFileTypeDetector
{
    string? DetectMimeType(Stream stream);
}