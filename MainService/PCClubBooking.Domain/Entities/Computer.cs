using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Domain.Entities;

public class Computer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsWorking { get; set; } = true;
    public decimal PricePerHour { get; set; }
    public ComputerCategory Category { get; set; }

    public ICollection<Device> Devices { get; set; } = new List<Device>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}   
