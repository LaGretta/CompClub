using AuthService.Domain.Abstractions.Models;

namespace AuthService.Domain.Models.Base;

public class EntityBase: IEntityBase
{
    public Guid Id { get; set; }
}