
using AuthService.API.Controllers.Extensions;
using AuthService.Application.Services.Abstractions;
using AuthService.Application.Tools;
using AuthService.Domain.Requests.Auth;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.API.Controllers;

[ApiController]
[Route("api/")]
public class AuthController: ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IHttpCookieService _cookieService;

    public AuthController(
        IAuthService authService,
        IHttpCookieService cookieService)
    {
        _authService = authService;
        _cookieService = cookieService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserRequest fromBody,CancellationToken cancellationToken)
    {
        var userAgent =  HttpContext.Request.Headers.UserAgent;
        var ipAddress = HttpContext.GetClientIpAddress();
        //
        var result = await _authService.Login(new()
        {
            Login = fromBody.Login,
            Password = fromBody.Password,
            //
            UserAgent = userAgent,
            IpAddress = ipAddress!=null? ipAddress.ToString() : null,
            //
            HttpCookies=HttpContext.Request.GetCookies()
        }, cancellationToken);
        _cookieService.Apply(HttpContext.Response, result.Cookies);
        //
        return Ok(result.Data);
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest fromBody,CancellationToken cancellationToken)
    {
        var userAgent =  HttpContext.Request.Headers.UserAgent;
        var ipAddress = HttpContext.GetClientIpAddress();
        
        var result = await _authService.Register(new() {
            Name = fromBody.UserName,
            Password = fromBody.Password,
            ConfirmPassword = fromBody.ConfirmPassword,
            Email = fromBody.Email,
            //
            UserAgent = userAgent,
            IpAddress = ipAddress!=null? ipAddress.ToString() :  null
            
        }, cancellationToken);
        _cookieService.Apply(HttpContext.Response, result.Cookies);
        //
        return Ok(result.Data);
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
    {
        var userAgent =  HttpContext.Request.Headers.UserAgent;
        var ipAddress = HttpContext.GetClientIpAddress();
        
        var result = await _authService.RefreshToken(new() {
            HttpCookies = HttpContext.Request.GetCookies(),
            //
            UserAgent = userAgent,
            IpAddress = ipAddress!=null? ipAddress.ToString() :  null
            
        }, cancellationToken);
        _cookieService.Apply(HttpContext.Response, result.Cookies);
        //
        return Ok(result.Data);
    }
    [HttpDelete("logout/{id}")]
    public async Task<IActionResult> Logout([FromRoute] Guid id,CancellationToken cancellationToken)
    {
        var result= await _authService.Logout(new() {
                SessionIdToDelete = id,
                //
                HttpCookies = HttpContext.Request.GetCookies()
            }, cancellationToken);
        _cookieService.Apply(HttpContext.Response, result.Cookies);
        //
        return Ok(result.Data);
    }
    [HttpDelete("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var result = await _authService.Logout(new() {
            HttpCookies = HttpContext.Request.GetCookies()
                
            }, cancellationToken);
        _cookieService.Apply(HttpContext.Response, result.Cookies);
        //
        return Ok(result.Data);
    }
}