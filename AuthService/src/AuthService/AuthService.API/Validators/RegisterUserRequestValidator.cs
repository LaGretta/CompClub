using AuthService.Domain.Requests.Auth;
using FluentValidation;

namespace AuthService.Api.Validators;

public class RegisterUserRequestValidator: AbstractValidator<RegisterUserRequest>
{
    public RegisterUserRequestValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty()
            .Length(3, 30)
            .Matches(@"^(?!.*__)\p{L}[\p{L}\p{N}_]*(?<!_)$")
            .WithMessage(
                "Username must start with a letter, contain only letters, digits and underscores, cannot end with '_' or contain '__'.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(100);

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Passwords do not match.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .Length(8, 64)
            .Matches(@"[A-Z]").WithMessage("Password must contain an uppercase letter.")
            .Matches(@"[a-z]").WithMessage("Password must contain a lowercase letter.")
            .Matches(@"\d").WithMessage("Password must contain a digit.")
            .Matches(@"[\W_]").WithMessage("Password must contain a special character.");

    }
}