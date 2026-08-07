using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Application.DTOs;

public class CreateBookingDto
{
    public int ComputerId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

public class ResponseBookingDto
{
    public int Id { get; set; }       
    public int UserId { get; set; }
    public int ComputerId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}