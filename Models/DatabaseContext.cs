using Microsoft.EntityFrameworkCore;
namespace Emailspage.Models;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options){}

    public DbSet<Users> Users {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>().ToTable("users");
        modelBuilder.Entity<Users>()
        .Property(u => u.id)
        .ValueGeneratedOnAdd();
    }
}
