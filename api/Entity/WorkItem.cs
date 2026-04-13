using api.Controllers;

namespace api.Entity;

public class WorkItem
{
    public int Id { get; set; }
   
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public EWorkStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? DueDate { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;

    public bool Update(ItemController.ItemData data)
    {
        bool result = false;
        if (string.IsNullOrEmpty(data.Name) == false && data.Name != Title)
        {
            Title = data.Name;
            result = true;
        }

        if (string.IsNullOrEmpty(data.Description) == false && data.Description != Description)
        {
            Description = data.Description;
            result = true;
        }

        if (data.Status != Status)
        {
            Status = data.Status;
            result = true;
        }
        
        return result;
    }
}

public enum EWorkStatus
{
    Todo,
    InProgress,
    Completed,
}