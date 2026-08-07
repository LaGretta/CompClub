namespace PCClubBooking.Application.DTOs;

public class CreateDeviceDto
{
    public string Name { get; set; } = string.Empty;
    public int ComputerId { get; set; }
}
public class UpdateDeviceDto
{
    public string Name { get; set; } = string.Empty;
}
public class DeviceResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int ComputerId { get; set; }
}