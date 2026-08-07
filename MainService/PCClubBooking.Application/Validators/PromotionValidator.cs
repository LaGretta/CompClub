using FluentValidation;
using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Validators;

public class CreatePromotionValidator : AbstractValidator<CreatePromotionDto>
{
    public CreatePromotionValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Promotion name cannot be empty")
            .MinimumLength(3).WithMessage("Promotion name must be 3–30 characters")
            .MaximumLength(30).WithMessage("Promotion name must be 3–30 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Promotion description cannot be empty")
            .MinimumLength(3).WithMessage("Description must be 3–500 characters")
            .MaximumLength(500).WithMessage("Description must be 3–500 characters");
        
        RuleFor(x => x.DiscountPercent)
            .InclusiveBetween(1, 100).WithMessage("Discount percent must be between 1 and 100");
        
        RuleFor(x => x.ValidUntil)
            .GreaterThan(DateTime.UtcNow).WithMessage("Valid until must be in the future");
    }
}