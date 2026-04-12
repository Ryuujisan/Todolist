using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }
    
    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("This is not good request");
    }
    
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }
    
    [HttpGet("validation-error")]
    public IActionResult GetValidationError()
    {
        ModelState.AddModelError("Problle", "Problem nr 1");
        ModelState.AddModelError("Problle", "Problem nr 2");
        return ValidationProblem();
    }
    
    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("Server error");
    }
}