using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace api.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            await HandleException(context, e);
        }
    }
    
    private async Task HandleException(HttpContext context, Exception exception)
    {
        logger.LogError(exception, exception.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ProblemDetails()
        {
            Status = 500,
            Detail = env.IsDevelopment() ? exception.StackTrace?.ToString() : "Internal Server Error",
            Title = exception.Message
        };

        var option = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        var json = JsonSerializer.Serialize(response, option);
        
        await context.Response.WriteAsync(json);
    }
}