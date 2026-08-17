using AuthService.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuthService.Storage.Configurations;

public class UserConfiguration:IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        //IBase
        builder.HasKey(s => s.Id);
        builder.Property(x => x.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .ValueGeneratedOnAdd();
        //
        builder.HasIndex(u => u.Email)
            .IsUnique();
        //
        builder.Property(u => u.Balance)
            .HasPrecision(18, 2)
            .HasDefaultValue(0m);
        //ISoftDeletable
        builder.HasQueryFilter(u => !u.DeletedAt.HasValue);
    }
}
