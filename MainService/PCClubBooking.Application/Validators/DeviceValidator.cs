using FluentValidation;
using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Validators;

public class CreateDeviceValidator : AbstractValidator<CreateDeviceDto>
{
    public CreateDeviceValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MinimumLength(3)
            .WithMessage("Name must be between 3 and 30 characters long")
            .MaximumLength(30)
            .WithMessage("Name must be between 3 and 30 characters long");
    }
}