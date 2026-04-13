using System.Diagnostics;
using api.Data;
using api.Entity;
using api.Models.User;
using api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace api.Controllers;

public class AuthController(IJwtTokenGenerator jwtTokenGenerator, 
    ToDoContext dbContext, 
    IOptions<JwtOptions> jwtOptions,
    IMapper mapper) : BaseApiController
{
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login([FromBody] AuthData? authData)
    {
        if (authData is null)
        {
            return BadRequest("Request body is required");
        }
        
        if (string.IsNullOrWhiteSpace(authData.Email) || string.IsNullOrWhiteSpace(authData.Password))
        {
            return BadRequest("Email and password are required");
        }

        var user = await FetchUser(authData.Email);
        if (user == null || !user.VerifyPassword(authData.Password))
        {
            return Unauthorized("Invalid email or password");
        }

        CreateJwtCookie(user);

        return Ok(mapper.Map<UserDto>(user));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return Unauthorized();
        }

        var user = await FetchUser(userId);
            
        if(user == null)
        {
            return Unauthorized();
        }

        if (user.Workspaces.Count == 0)
        {
            dbContext.Workspaces.Add(new Workspace()
            {
                Owner = user,
                Name = $"{user.Name}'s Workspace",
                CreatedAt = DateTime.UtcNow
            });
        }
        await dbContext.SaveChangesAsync();
        return  Ok(mapper.Map<UserDto>(user));
    }

    
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] AuthData data)
    {
        if (data is null)
        {
            return BadRequest("Request body is required");
        }

        if (string.IsNullOrWhiteSpace(data.Email) || string.IsNullOrWhiteSpace(data.Password))
        {
            return BadRequest("Email and password are required");
        }

        if (await dbContext.Users.AnyAsync(u => u.Email == data.Email))
        {
            return BadRequest("Email already exists");
        }

        var user = new User
        {
            Email = data.Email,
            Password = string.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Name = string.IsNullOrWhiteSpace(data.Name) ? data.Email.Split('@')[0] : data.Name,
        };

        user.HashPassword(data.Password);

        dbContext.Users.Add(user);
        var result = await dbContext.SaveChangesAsync() > 0;

        if (result)
        {
            CreateJwtCookie(user);
            return Ok(user);
        }

        return BadRequest("Problem with create user");
    }

    [Authorize]
    [HttpPost("logout")]
    public ActionResult Logout()
    {
        Response.Cookies.Delete(JwtTokenGenerator.CookieName, new CookieOptions
        {
            SameSite = SameSiteMode.None,
            Secure = true,
            Path = "/"
        });
        Console.WriteLine("Logout " + Response.Cookies);
        return Ok();
    }

    [Authorize]
    [HttpPut("update")]
    public async Task<ActionResult<UserDto>> Update([FromBody] AuthData data)
    {
        if (data is null)
        {
            return BadRequest("Request body is required");
        }

        var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return Unauthorized();
        }

        var user = FetchUser(userId).Result;
        if (user == null)
        {
            return Unauthorized();
        }

        if (user.Update(data.Name, data.Descriptions, data.Password ?? string.Empty))
        {
            await dbContext.SaveChangesAsync();
        }

        return Ok(mapper.Map<UserDto>(user));
    } 

    private void CreateJwtCookie(User user)
    {
        var token = jwtTokenGenerator.GenerateToken(user.Id, user.Email);
        Response.Cookies.Append(JwtTokenGenerator.CookieName, token, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true,
            Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes),
            IsEssential = true,
            Path = "/"
        });
    }
    
    private async Task<User?> FetchUser(int userId)
    {
        return await dbContext.Users
            .Include(x => x.Workspaces)
            .FirstOrDefaultAsync(f => f.Id == userId);
    }
    
    private async Task<User?> FetchUser(string email)
    {
        return await dbContext.Users
            .Include(x => x.Workspaces)
            .FirstOrDefaultAsync(f => f.Email == email);
    }
    
    // Helper Classes
    public class AuthData
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? Descriptions { get; set; }
    }
}