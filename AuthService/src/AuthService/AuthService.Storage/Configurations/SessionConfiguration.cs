using AuthService.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuthService.Storage.Configurations;

public class SessionConfiguration:IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        //Guid field setup
        builder.HasKey(s => s.Id);
        builder.Property(x => x.Id)
            .HasDefaultValueSql("NEWSEQUENTIALID()")
            .ValueGeneratedOnAdd();
        //
        builder.HasOne(s => s.User).WithMany(u => u.Sessions).HasForeignKey(s => s.UserId);
    }
}