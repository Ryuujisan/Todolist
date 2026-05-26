using System;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Entity;
using api.Models.Items;
using api.Utils;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

public class ItemController(ToDoContext context, IMapper mapper) : BaseApiController
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ItemDto[]>> Get()
    {
        if(ControllerUtils.GetUserId(User, out int userId) == false)
        {
            return Unauthorized();
        }

        var user = await context.FetchUser(userId);
        
        if(user == null)
        {
            return NotFound();
        }
        var items = await context.WorkItems
            .Include(x => x.Workspace)
            .Include(x => x.User)
            .Where(x => x.User.Id == userId).ToListAsync();
        return Ok(mapper.Map<ItemDto[]>(items));
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<ItemDto>> GetById(int id)
    {
        if(ControllerUtils.GetUserId(User, out int userId) == false)
        {
            return Unauthorized();
        }
        
        var item = await context.WorkItems
            .Include(x => x.Workspace)
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);
        
        if(item == null)
        {
            return NotFound();
        }

        if (item.User.Id != userId)
        {
            return Unauthorized();
        }
        return Ok(mapper.Map<ItemDto>(item));
    }
    
    [HttpPost("create")]
    [Authorize]
    public async Task<ActionResult<ItemDto>> Create([FromBody]ItemData? data)
    {
        if (data is null)
        {
            return BadRequest("Request body is required");
        }

        Console.WriteLine($"workd space id: {data.WorkspaceId}");
        Console.WriteLine($"title: {data.Name}");
        Console.WriteLine($"description: {data.Description}");
        Console.WriteLine($"status: {data.Status}");

        
        if (ControllerUtils.GetUserId(User, out int userId) == false)
        {
            return Unauthorized();
        }
        
        var workspace = await context.FetchWorkspaceById(data.WorkspaceId);
        var user = await context.FetchUser(userId);

        if (workspace == null || user == null)
        {
            return NotFound();
        }
        
        context.WorkItems.Add(new WorkItem
        {
            Title = data.Name, 
            Workspace = workspace,
            User = user,
            Description = data?.Description ?? string.Empty,
            Status = data.Status,
            CreatedAt = DateTime.UtcNow
        });
        
        var result = await context.SaveChangesAsync() > 0;
        return result ? Ok(mapper.Map<ItemDto>(workspace.Items.Last())) : BadRequest("Problem with create item");
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ItemDto>> Update([FromBody] ItemData? data, int id)
    {
        if (data is null)
        {
            return BadRequest("Request body is required");
        }

        if (ControllerUtils.GetUserId(User, out int userId) == false)
        {
            return Unauthorized();
        }
        
        var item = await context.WorkItems
            .Include(x => x.Workspace)
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }
        
        if (item.User.Id != userId)
        {
            return Unauthorized();
        }
        
        if(item.Update(data))
        {
            var result = await context.SaveChangesAsync() > 0;
            return result ? Ok(mapper.Map<ItemDto>(item)) : BadRequest("Problem with update item");
        }
        
        return BadRequest("Nothing to update");
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        if (ControllerUtils.GetUserId(User, out int userId) == false)
        {
            return Unauthorized();
        }
        var item = await context.WorkItems
            .Include(x => x.Workspace)
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }
        
        if (item.User.Id != userId)
        {
            return Unauthorized();
        }
        
        context.WorkItems.Remove(item);
        var result = await context.SaveChangesAsync() > 0;
        return result ? Ok() : BadRequest("Problem with delete item");
    }
    
    public class ItemData
    {
        public string Name { get; set; }
        public int WorkspaceId { get; set; }
        public string? Description { get; set; }
        public EWorkStatus Status { get; set; }
    }
}