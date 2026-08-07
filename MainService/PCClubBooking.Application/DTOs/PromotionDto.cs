namespace PCClubBooking.Application.DTOs;

public class CreatePromotionDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public DateTime ValidUntil { get; set; }
}
public class UpdatePromotionDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public DateTime ValidUntil { get; set; }
}
public class PromotionResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public DateTime ValidUntil { get; set; }
}