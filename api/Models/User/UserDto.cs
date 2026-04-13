namespace api.Models.User;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string? Name { get; set; }
    public string? Descriptions { get; set; }

    public List<ProfileWorkspaceDto> Workspaces { get; set; } = [];
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}