
namespace PCClubBooking.Domain.Entities;

public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public DateTime ValidUntil { get; set; }
}