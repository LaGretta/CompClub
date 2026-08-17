using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Options;
using AuthService.Domain.Exceptions.Services.Avatar;

namespace AuthService.Application.Services;

using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

public class UserAvatarStorage : IUserAvatarStorage
{
    private readonly IAmazonS3 _s3;
    private readonly S3Options _s3Options;
    private readonly AvatarOptions _avatarOptions;
    private readonly IFileTypeDetector _fileTypeDetector;

    public UserAvatarStorage(IAmazonS3 s3, IOptions<S3Options> s3Options, IOptions<AvatarOptions> avatarOptions,  IFileTypeDetector fileTypeDetector)
    {
        _s3 = s3;
        _s3Options = s3Options.Value;
        _avatarOptions = avatarOptions.Value;
        _fileTypeDetector = fileTypeDetector;
    }

    private static string CreateKey(Guid userId)
    {
        return $"avatars/{userId}";
    }

    public async Task UploadAsync(Guid userId, Stream stream)
    {
        if (stream == null) throw new ArgumentNullException(nameof(stream));
        if (!stream.CanRead) throw new ArgumentException("The stream must be readable.", nameof(stream));
        //
        var contentType = _fileTypeDetector.DetectMimeType(stream);
        if (contentType==null || !_avatarOptions.AllowedMimeTypes.Contains(contentType))
            throw new AllowedMimeTypesException(contentType);

        var key = CreateKey(userId);

        var request = new PutObjectRequest
        {
            BucketName = _s3Options.BucketName,
            Key = key,
            InputStream = stream,
            ContentType = contentType
        };

        await _s3.PutObjectAsync(request);
    }

    public async Task DeleteAsync(Guid userId)
    {
        var key = CreateKey(userId);

        var request = new DeleteObjectRequest
        {
            BucketName = _s3Options.BucketName,
            Key = key
        };

        await _s3.DeleteObjectAsync(request);
    }

    public string GetPresignedUrl(Guid userId)
    {
        var key = CreateKey(userId);

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _s3Options.BucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddMinutes(15),
            Verb = HttpVerb.GET
        };

        return _s3.GetPreSignedURL(request);
    }
}