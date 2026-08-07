namespace PCClubBooking.Domain.Entities;

public class Device
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int ComputerId { get; set; }
    public Computer Computer { get; set; } = null!;
}
