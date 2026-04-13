using api.Entity;

namespace api.Models.Workspaces;

public class WorkspaceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public WorkspaceUserDto Owner { get; set; } = null!;
    public List<ItemViewDto> Items { get; set; } = [];
}

public class ItemViewDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public EWorkStatus Status { get; set; }
}

public class WorkspaceUserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}