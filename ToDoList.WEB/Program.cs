using System.ComponentModel;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using ToDoList.WEB.Controllers;
using ToDoList.WEB.Data.DbContext;
using ToDoList.WEB.Data.Models;

namespace ToDoList.WEB
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<ToDoListDbContext>();

            // Add services to the container.
            builder.Services.AddControllersWithViews()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                   options.JsonSerializerOptions.Converters.Add(new DateTimeFormatConverter("yyyy-MM-dd"));
                });
            builder.Services.AddSwaggerGen();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");


            app.Run();
        }
    }

    public class DateTimeFormatConverter : JsonConverter<DateTime>
    {
        private readonly string format;

        public DateTimeFormatConverter(string format)
        {
            this.format = format;
        }

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.ParseExact(
                reader.GetString(),
                this.format,
                CultureInfo.InvariantCulture);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            ArgumentNullException.ThrowIfNull(writer, nameof(writer));

            writer.WriteStringValue(value
                .ToString(
                    this.format,
                    CultureInfo.InvariantCulture));
        }
    }
}