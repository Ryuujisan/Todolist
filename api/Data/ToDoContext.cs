using api.Entity;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class ToDoContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<User> Users { get; set; }
}