using AuthService.Api.Requests;
using AuthService.Domain.Requests.Auth;
using FluentValidation;

namespace AuthService.Api.Validators;

public class TransactionExecuteValidator: AbstractValidator<TransactionExecuteRequest>
{
    public TransactionExecuteValidator()
    {
        RuleFor(x => x.Value).NotEqual(0);

    }
}