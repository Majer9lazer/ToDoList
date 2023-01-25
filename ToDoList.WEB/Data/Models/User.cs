using ToDoList.WEB.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
namespace ToDoList.WEB.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        public string VisitorId { get; set; }

        public virtual ICollection<ToDoItem>? ToDoItems { get; set; } = null!;
    }
}
