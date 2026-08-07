namespace AuthService.Domain.Enums.Cookies;

public enum SameSitePolicy//not used because used enum from microsoft- SameSiteMode
{
    Strict=0,
    Lax=1,
    None=2
}