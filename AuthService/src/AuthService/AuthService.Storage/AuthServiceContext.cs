using AuthService.Domain.Models;
using AuthService.Storage.Configurations;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Storage;


public class AuthServiceContext : DbContext, IUnitOfWork
{
    public AuthServiceContext(DbContextOptions<AuthServiceContext> options) : base(options) { }
    
    public DbSet<Session> Sessions { get; set; }
    public DbSet<User> Users { get; set; }
    //
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(SessionConfiguration).Assembly);
        builder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
        builder.ApplyConfigurationsFromAssembly(typeof(RoleConfiguration).Assembly);
        builder.ApplyConfigurationsFromAssembly(typeof(UserRoleConfiguration).Assembly);
    }
}