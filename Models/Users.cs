namespace Emailspage.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Users
{
    [Key]
    [Column("id")]
    public int id { get; set; }
    public required string name {get;set;}
    public required string password { get; set; }

}