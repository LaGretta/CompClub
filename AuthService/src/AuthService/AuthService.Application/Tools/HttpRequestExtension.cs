using System.Net;
using Microsoft.AspNetCore.Http;

namespace AuthService.Application.Tools;

public static class HttpRequestExtensions
{
    public static IPAddress? GetClientIpAddress(this HttpContext context)
    {
        var request = context.Request;

        string[] headers =
        {
            "CF-Connecting-IP",
            "X-Real-IP",
            "X-Forwarded-For",
            "Forwarded"
        };

        foreach (var header in headers)
        {
            if (!request.Headers.TryGetValue(header, out var value))
                continue;

            var ip = value.ToString();

            if (string.IsNullOrWhiteSpace(ip))
                continue;

            if (header == "X-Forwarded-For")
            {
                ip = ip.Split(',')[0].Trim();
            }

            if (header == "Forwarded")
            {
                // for=192.168.1.10;proto=https
                var forPart = ip.Split(';')
                    .FirstOrDefault(x => x.Trim().StartsWith("for="));

                if (forPart != null)
                {
                    ip = forPart.Split('=')[1].Trim('"');
                }
            }

            if (IPAddress.TryParse(ip, out var address))
                return address;
        }

        return context.Connection.RemoteIpAddress;
    }
}