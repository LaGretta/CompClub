using Microsoft.EntityFrameworkCore;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Infrastructure.Data;

/// <summary>
/// Демо-наповнення: виконується на старті після міграцій.
/// Додає дані тільки якщо відповідні таблиці порожні (ідемпотентно).
/// </summary>
public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        if (!await db.Computers.AnyAsync(ct))
        {
            db.Computers.AddRange(
                new Computer
                {
                    Name = "Neo-01", Category = ComputerCategory.Standard, PricePerHour = 55m, IsWorking = true,
                    Devices = new List<Device>
                    {
                        new() { Name = "Клавіатура Logitech G213" },
                        new() { Name = "Миша Logitech G102" },
                        new() { Name = "Навушники HyperX Cloud Stinger" },
                    },
                },
                new Computer
                {
                    Name = "Neo-02", Category = ComputerCategory.Standard, PricePerHour = 55m, IsWorking = true,
                    Devices = new List<Device>
                    {
                        new() { Name = "Клавіатура Razer Cynosa" },
                        new() { Name = "Миша Razer DeathAdder" },
                    },
                },
                new Computer
                {
                    Name = "Titan VIP-01", Category = ComputerCategory.VIP, PricePerHour = 120m, IsWorking = true,
                    Devices = new List<Device>
                    {
                        new() { Name = "Клавіатура Corsair K95 RGB" },
                        new() { Name = "Миша Logitech G Pro X" },
                        new() { Name = "Навушники SteelSeries Arctis 7" },
                        new() { Name = "Монітор 240Hz" },
                    },
                },
                new Computer
                {
                    Name = "Titan VIP-02", Category = ComputerCategory.VIP, PricePerHour = 120m, IsWorking = false,
                    Devices = new List<Device>
                    {
                        new() { Name = "Клавіатура Corsair K70" },
                        new() { Name = "Миша Razer Viper" },
                        new() { Name = "Монітор 165Hz" },
                    },
                },
                new Computer
                {
                    Name = "PlayZone PS5-01", Category = ComputerCategory.PS5, PricePerHour = 90m, IsWorking = true,
                    Devices = new List<Device>
                    {
                        new() { Name = "DualSense контролер ×2" },
                        new() { Name = "Телевізор 4K 55\"" },
                        new() { Name = "Навушники Pulse 3D" },
                    },
                },
                new Computer
                {
                    Name = "PlayZone PS5-02", Category = ComputerCategory.PS5, PricePerHour = 90m, IsWorking = true,
                    Devices = new List<Device>
                    {
                        new() { Name = "DualSense контролер ×2" },
                        new() { Name = "Телевізор 4K 55\"" },
                    },
                }
            );
            await db.SaveChangesAsync(ct);
        }

        if (!await db.Promotions.AnyAsync(ct))
        {
            db.Promotions.AddRange(
                new Promotion
                {
                    Name = "Нічний тариф",
                    Description = "З 23:00 до 08:00 — знижка на всі стандартні місця.",
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
