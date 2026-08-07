using AuthService.Domain.Requests.Auth;
using FluentValidation;

namespace AuthService.Api.Validators;

public class LoginUserRequestValidator: AbstractValidator<LoginUserRequest>
{
    public LoginUserRequestValidator()
    {
        RuleFor(x => x.Login)
            .NotEmpty()
            .MaximumLength(100);

        When(x => x.Login.Contains('@'), () =>
        {
            RuleFor(x => x.Login)
                .EmailAddress();
        });

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}