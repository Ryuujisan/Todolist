using api.Data;
using api.Entity;
using api.Models.User;
using api.Models.Workspaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

public class WorkspaceController(ToDoContext context, IMapper mapper) : BaseApiController
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ProfileWorkspaceDto[]>> Get()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userId, out var id))
        {
            return Unauthorized();
        }
        var user = await FetchUser(id);
        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(mapper.Map<ProfileWorkspaceDto[]>(user.Workspaces));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkspaceDto>> GetById(int id)
    {
        var workspace = await FetchWorkspaceById(id);
        if (workspace == null)
        {
            return NotFound();
        }
        return Ok(mapper.Map<WorkspaceDto>(workspace));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<WorkspaceDto>> Update(int id, [FromBody] WorkspaceData? data)
    {
        if (data is null)
        {
            return BadRequest("Request body is required");
        }
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userId, out var idUser))
        {
            return Unauthorized();
        }
        
        var workspace = await FetchWorkspaceById(id);
        if (workspace == null)
        {
            return NotFound();
        }
        
        if (workspace.Owner.Id != idUser)
        {
            return Unauthorized();
        }
        
        workspace.Name = data.Name ?? workspace.Name;
        workspace.Description = data.Descriptions ?? workspace.Description;
        context.Workspaces.Update(workspace);
        var result = await context.SaveChangesAsync() > 0;
        return result ? Ok(mapper.Map<WorkspaceDto>(workspace)) : BadRequest("Problem with update workspace");
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<ActionResult<WorkspaceDto>> CreateWorkspace([FromBody] WorkspaceData data)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userId, out var id))
        {
            return Unauthorized();
        }
        var user = await FetchUser(id);
        
        if (user == null)
        {
            return NotFound();
        }

        var workspace = new Workspace
        {
            Name = data.Name ?? "Untitled Workspace",
            Description = data.Descriptions ?? string.Empty,
            Owner = user,
        };
        context.Workspaces.Add(workspace);
        var result = await context.SaveChangesAsync() > 0;
        return result ? Ok(mapper.Map<WorkspaceDto>(workspace)) : BadRequest("Problem with create workspace");
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userId, out var idUser))
        {
            return Unauthorized();
        }
        
        var workspace = await FetchWorkspaceById(id);
        if (workspace == null)
        {
            return NotFound();
        }
        if (workspace.Owner.Id != idUser)
        {
            return Unauthorized();
        }
        
        context.WorkItems.RemoveRange(workspace.Items);
        context.Workspaces.Remove(workspace);
        
        var result = await context.SaveChangesAsync() > 0;
        return result ? Ok() : BadRequest("Problem with delete workspace");
    }
    
    /// 

    private async Task<Workspace?> FetchWorkspaceById(int id)
    {
        return await context.Workspaces
            .Include(x => x.Items)
            .Include(x => x.Owner)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    private async Task<User?> FetchUser(int userId)
    {
        return await context.Users
            .Include(x => x.Workspaces)
            .FirstOrDefaultAsync(f => f.Id == userId);
    }
}

public class WorkspaceData
{
    public string? Name { get; set; }
    public string? Descriptions { get; set; }
}