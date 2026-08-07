using AuthService.Domain.Abstractions.Models;
using AuthService.Domain.Models.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace AuthService.Storage.Interceptors;

public class AuditInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;

        if (context == null)
            return base.SavingChangesAsync(eventData, result, cancellationToken);

        //var entries = context.ChangeTracker.Entries<EntityBase>();
        var entries = context.ChangeTracker.Entries();
        var utcNow = DateTime.UtcNow;
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Deleted && entry.Entity is ISoftDeletable softDelete)
            {
                entry.State = EntityState.Modified;

                softDelete.IsDeleted = true;
                softDelete.DeletedAt = utcNow;
            }

            if (entry.Entity is IAuditable auditable)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        auditable.CreatedAt = utcNow;
                        break;

                    case EntityState.Modified:
                        auditable.UpdatedAt = utcNow;
                        break;
                }
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}