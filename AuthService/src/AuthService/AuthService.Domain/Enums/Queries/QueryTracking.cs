namespace AuthService.Domain.Enums.Queries;

public enum QueryTracking
{
    Default = 0,
    Track = 1,
    NoTracking = 2,
    NoTrackingWithIdentityResolution = 3
}