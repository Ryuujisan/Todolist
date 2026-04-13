using api.Entity;
using api.Models.Workspaces;

namespace api.Models.Items;

public class ItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public EWorkStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public WorkspaceUserDto User {get; set; } = null!;
}