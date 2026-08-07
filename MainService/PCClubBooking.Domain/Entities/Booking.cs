using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Domain.Entities;

public class Booking
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ComputerId { get; set; }
    public Computer Computer { get; set; } = null!;

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
