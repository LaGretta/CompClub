using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Application.DTOs;

public class CreateComputerDto
{
    public string Name { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
    
    public ComputerCategory Category { get; set; }
}
public class UpdateComputerDto
{
    public string Name { get; set; } = string.Empty;
    public bool IsWorking { get; set; } 
    public decimal PricePerHour { get; set; }
}
public class ComputerResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsWorking { get; set; } 
    public decimal PricePerHour { get; set; }
    public ComputerCategory Category { get; set; }
}