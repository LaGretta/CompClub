using FluentValidation;
using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Validators;

public class CreateComputerValidator : AbstractValidator<CreateComputerDto>
{
    public CreateComputerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MinimumLength(3)
            .WithMessage("Name must be at least 3 characters long")
            .MaximumLength(50)
            .WithMessage("Name must not exceed 50 characters");
        RuleFor(x => x.PricePerHour)
            .GreaterThan(0)
            .WithMessage("Price per hour must be greater than zero");
        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Invalid computer category");
    }
}

