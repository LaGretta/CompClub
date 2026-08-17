namespace AuthService.Domain.Exceptions.Services.Avatar;

public class AllowedMimeTypesException: Exception
{
    string? FileContentType { get; set; }

    public AllowedMimeTypesException(string? fileContentType) : base($"A file content type prohibited by policy was used: {(fileContentType==null ? $"\"{fileContentType}\"" : "content type missing")}")
    {
        FileContentType = fileContentType;
    }
}