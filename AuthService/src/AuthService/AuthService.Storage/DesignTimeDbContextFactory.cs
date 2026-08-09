using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AuthService.Storage;

// Використовується ЛИШЕ інструментами EF (dotnet ef migrations), не в рантаймі.
// Дає змогу генерувати міграції без підняття всього застосунку (який вимагає Jwt-конфіг).
public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AuthServiceContext>
{
    public AuthServiceContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AuthServiceContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=auth;Username=postgres;Password=postgres")
            .Options;
        return new AuthServiceContext(options);
    }
}
