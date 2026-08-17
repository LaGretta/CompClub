using AuthService.Application.Services.Abstractions;
using MimeDetective;

namespace AuthService.Application.Services;

public class FileTypeDetector : IFileTypeDetector
{
    private readonly IContentInspector _inspector;

    public FileTypeDetector()
    {
        _inspector = new ContentInspectorBuilder
        {
            Definitions = MimeDetective.Definitions.DefaultDefinitions.All()
        }.Build();
    }

    public string? DetectMimeType(Stream stream)
    {
        var result = _inspector
            .Inspect(stream, resetPosition: true)
            .FirstOrDefault();

        return result?.Definition.File.MimeType;
    }
}