using AuthService.Api.Requests;
using AuthService.Domain.DTOs.Options;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace AuthService.Api.Validators;

public class AvatarUploadValidator: AbstractValidator<AvatarUploadRequest>
{
    private readonly AvatarOptions _options;
    
    public AvatarUploadValidator(IOptions<AvatarOptions> options)
    {
        _options = options.Value;
        
        RuleFor(x => x.File)
            .NotNull()
            .WithMessage("File is required.");

        RuleFor(x => x.File)
            .Must(file => file is not null && file.Length > 0)
            .WithMessage("File cannot be empty.");
        
        RuleFor(x => x.File)
            .Must(HaveAllowedExtension)
            .WithMessage("Unsupported file extension.");
        
        RuleFor(x => x.File)
            .Must(file =>
                file.Length <= _options.MaxFileSizeBytes)
            .WithMessage(
                $"Maximum file size is {_options.MaxFileSizeBytes} bytes.");
    }

    private bool HaveAllowedExtension(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName);

        return _options.AllowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);
    }
}