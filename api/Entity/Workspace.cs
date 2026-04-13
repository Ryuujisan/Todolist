namespace api.Entity;

public class Workspace
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public List<WorkItem> Items { get; set; } = new List<WorkItem>();
}