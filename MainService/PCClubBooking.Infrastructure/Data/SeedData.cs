using Microsoft.EntityFrameworkCore;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Infrastructure.Data;

/// <summary>
/// Наповнення каталогу. Ідемпотентно: додає лише те, чого ще немає (звіряння за назвою),
/// тож безпечно виконується на кожному старті й доливає нові ПК без ресету БД.
/// </summary>
public static class SeedData
{
    private static readonly (string Name, ComputerCategory Category, decimal Price, string[] Devices)[] Catalog =
    {
        ("Neo-01", ComputerCategory.Standard, 55m, new[] { "Клавіатура Logitech G213", "Миша Logitech G102", "Навушники HyperX Cloud Stinger" }),
        ("Neo-02", ComputerCategory.Standard, 55m, new[] { "Клавіатура Razer Cynosa", "Миша Razer DeathAdder" }),
        ("Neo-03", ComputerCategory.Standard, 55m, new[] { "Клавіатура HyperX Alloy", "Миша SteelSeries Rival 3" }),
        ("Neo-04", ComputerCategory.Standard, 60m, new[] { "Клавіатура Logitech G413", "Миша Logitech G305" }),
        ("Neo-05", ComputerCategory.Standard, 60m, new[] { "Клавіатура Razer Ornata", "Миша Razer Viper Mini" }),

        ("Titan VIP-01", ComputerCategory.VIP, 120m, new[] { "Клавіатура Corsair K95 RGB", "Миша Logitech G Pro X", "Навушники SteelSeries Arctis 7", "Монітор 240Hz" }),
        ("Titan VIP-02", ComputerCategory.VIP, 120m, new[] { "Клавіатура Corsair K70", "Миша Razer Viper", "Монітор 165Hz" }),
        ("Titan VIP-03", ComputerCategory.VIP, 140m, new[] { "Клавіатура Wooting 60HE", "Миша Pulsar X2", "Монітор 360Hz OLED" }),
        ("Titan VIP-04", ComputerCategory.VIP, 140m, new[] { "Клавіатура Ducky One 3", "Миша Zowie EC2", "Навушники HyperX Cloud II" }),

        ("PlayZone PS5-01", ComputerCategory.PS5, 90m, new[] { "DualSense ×2", "Телевізор 4K 55\"", "Навушники Pulse 3D" }),
        ("PlayZone PS5-02", ComputerCategory.PS5, 90m, new[] { "DualSense ×2", "Телевізор 4K 55\"" }),
        ("PlayZone PS5-03", ComputerCategory.PS5, 100m, new[] { "DualSense ×4", "Телевізор 4K 65\"" }),
    };

    public static async Task SeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        var existingNames = await db.Computers.Select(c => c.Name).ToListAsync(ct);

        var toAdd = Catalog
            .Where(item => !existingNames.Contains(item.Name))
            .Select(item => new Computer
            {
                Name = item.Name,
                Category = item.Category,
                PricePerHour = item.Price,
                IsWorking = true,
                Devices = item.Devices.Select(d => new Device { Name = d }).ToList(),
            })
            .ToList();

        if (toAdd.Count > 0)
        {
            db.Computers.AddRange(toAdd);
            await db.SaveChangesAsync(ct);
        }

        if (!await db.Promotions.AnyAsync(ct))
        {
            db.Promotions.AddRange(
                new Promotion
                {
                    Name = "Нічний тариф",
                    Description = "З 22:00 до 08:00 — знижка на всі стандартні місця.",
                    DiscountPercent = 30m,
                    ValidUntil = DateTime.UtcNow.AddMonths(3),
                },
                new Promotion
                {
                    Name = "Студентський день",
                    Description = "Щосереди за студентським квитком — мінус третина від ціни.",
                    DiscountPercent = 33m,
                    ValidUntil = DateTime.UtcNow.AddMonths(2),
                },
                new Promotion
                {
                    Name = "Happy Hours",
                    Description = "Будні 12:00–15:00 — найкраща ціна на VIP та PS5.",
                    DiscountPercent = 20m,
                    ValidUntil = DateTime.UtcNow.AddMonths(1),
                }
            );
            await db.SaveChangesAsync(ct);
        }
    }
}
