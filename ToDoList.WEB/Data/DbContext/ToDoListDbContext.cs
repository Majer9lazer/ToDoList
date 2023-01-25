using Microsoft.EntityFrameworkCore;
using ToDoList.WEB.Data.Models;

namespace ToDoList.WEB.Data.DbContext
{
    public class ToDoListDbContext:Microsoft.EntityFrameworkCore.DbContext
    {
        public DbSet<ToDoItem> ToDoItems { get; set; }
        public DbSet<User> Users { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source=ToDoItems.db");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ToDoItem>().HasOne<User>(t => t.User);
            modelBuilder.Entity<User>().HasMany<ToDoItem>(t => t.ToDoItems);

        }
    }

}
