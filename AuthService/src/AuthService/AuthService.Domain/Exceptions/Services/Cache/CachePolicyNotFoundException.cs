namespace AuthService.Domain.Exceptions.Services.Cache;

public class CachePolicyNotFoundException: Exception
{
    public Type Type { get; init; }
    public CachePolicyNotFoundException(Type type): base($"Cache settings for the \"{type}\" type are not defined")
    {
        Type = type;    
    }
}