using Microsoft.EntityFrameworkCore;
using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Computer> Computers { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<Promotion> Promotions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Promotion>().HasIndex(n => n.Name).IsUnique();
        
        modelBuilder.Entity<Booking>().Property(n => n.TotalPrice).HasPrecision(18, 2);
        modelBuilder.Entity<Computer>().Property(n => n.PricePerHour).HasPrecision(18, 2);
        modelBuilder.Entity<Promotion>().Property(n => n.DiscountPercent).HasPrecision(18, 2);

        modelBuilder.Entity<Computer>()
            .HasMany(n => n.Bookings)
            .WithOne(n => n.Computer)
            .HasForeignKey(n => n.ComputerId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Computer>()
            .HasMany(n => n.Devices)
            .WithOne(n => n.Computer)
            .HasForeignKey(n => n.ComputerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}