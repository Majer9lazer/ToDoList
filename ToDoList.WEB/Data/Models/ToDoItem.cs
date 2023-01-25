namespace ToDoList.WEB.Data.Models
{
    public class ToDoItem
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string? Text { get; set; }

        public DateTime CreationDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public bool IsFinished { get; set; }
        public virtual User? User { get; set; }
        public int UserId { get; set; }
    }
}
