using System.Security.Claims;

namespace api.Utils;

public static class ControllerUtils
{
    public static bool GetUserId(ClaimsPrincipal user, out int id)
    {
        
        var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userId, out id))
        {
            return false;
        }
        return true;
    }
}