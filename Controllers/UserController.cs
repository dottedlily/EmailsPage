using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Emailspage.Models;


[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly DatabaseContext _context;
    
    public UserController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet("GetUsers")]
    public async Task<IActionResult> GetUser()
    {
        var result = await _context.Users.Select(x => new Users
        {
            id = x.id,
            email = x.email,
            name = x.name,
            password = x.password,
            verified = x.verified,
            blocked = x.blocked
        }).ToListAsync();

        return Ok(result);
    }

    [HttpPost("CreateUser")]
    public async Task<IActionResult> CreateUser([FromBody] Users user)
    {
        try{
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException is PostgresException postgresEx &&
        postgresEx.SqlState == "23505")
            {
                return Conflict("This username already exists.");
            }

            return StatusCode(500, "Database error.");
        }
    }

    [HttpPut("EditUser")]
    public async Task<IActionResult> EditUser([FromBody] Users user)
    {
        var rows = await _context.Users.Where(x => x.id == user.id).ExecuteUpdateAsync(x => x.SetProperty(x => x.blocked, user.blocked).SetProperty(x => x.verified, user.verified));
        return Ok(user);
    }

    [HttpDelete("DeleteUser")]
    public async Task<IActionResult> DeleteUser(string userEmail)
    {
        var rows = await _context.Users.Where(x => x.email == userEmail).ExecuteDeleteAsync();
        return Ok(true);
    }

}
