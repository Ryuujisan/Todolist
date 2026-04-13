using api.Entity;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class ToDoContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<User> Users { get; set; }
    public required DbSet<Workspace> Workspaces { get; set; }
    public required DbSet<WorkItem> WorkItems { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<Workspace>().ToTable("Workspaces");
        modelBuilder.Entity<WorkItem>().ToTable("WorkItems");

        modelBuilder.Entity<Workspace>()
            .HasOne(w => w.Owner)
            .WithMany(u => u.Workspaces)
            .HasForeignKey(w => w.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
    
        public async Task<User?> FetchUser(int userId)
        {
            return await Users
                .Include(x => x.Workspaces)
                .FirstOrDefaultAsync(f => f.Id == userId);
        }
        
        public async Task<Workspace?> FetchWorkspaceById(int id)
        {
            return await Workspaces
                .Include(x => x.Items)
                .Include(x => x.Owner)
                .FirstOrDefaultAsync(f => f.Id == id);
        }
}