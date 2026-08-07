using FluentValidation;
using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Validators;

public class CreateBookingValidator : AbstractValidator<CreateBookingDto>
{
    public CreateBookingValidator()
    {
        RuleFor(x => x.ComputerId)
            .GreaterThan(0)
            .WithMessage("Computer id must be greater than zero");
        RuleFor(x => x.StartTime)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Start time must be in the future");
        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime)
            .WithMessage("End time must be after start time");
    }
}