using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            name = x.name,
            password = x.password

        }).ToListAsync();
        return Ok(result);
    }

    [HttpPost("CreateUser")]
    public async Task<IActionResult> CreateUser([FromBody] Users user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpPut("EditUser")]
    public async Task<IActionResult> EditUser([FromBody] Users user)
    {
        var rows = await _context.Users.Where(x => x.id == user.id).ExecuteUpdateAsync(x => x.SetProperty(x => x.name, user.name));
        return Ok(user);
    }

    [HttpDelete("DeleteUser")]
    public async Task<IActionResult> DeleteUser(int userid)
    {
        var rows = await _context.Users.Where(x => x.id == userid).ExecuteDeleteAsync();
        return Ok(true);
    }

}
