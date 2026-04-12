using api.Extensions;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddControllers();
builder.Services.AddDbContext<ToDoContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.SetupApi(builder.Configuration);
builder.Services.SetupJWT(builder.Configuration);
builder.Services.AddCors();
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000"));

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
