namespace api.Entity;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Name { get; set; }
    public string? Descriptions { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public void HashPassword(string password)
    {
        Password = BCrypt.Net.BCrypt.HashPassword(password);
    }
    public bool VerifyPassword(string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, Password);
    }
    
    public bool Update(string name, string? descriptions, string password)
    {
        bool result = false;
        if (!string.IsNullOrEmpty(name))
        {
            Name = name;
            result = true;
        }

        if (!string.IsNullOrEmpty(descriptions))
        {
            Descriptions = descriptions;
            result = true;
        }

        if (!string.IsNullOrEmpty(password))
        {
            HashPassword(password);
            result = true;
        }

        if (result)
        {
            UpdatedAt = DateTime.UtcNow;
        }
        return result;
    }
}