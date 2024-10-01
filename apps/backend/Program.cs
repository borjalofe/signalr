using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using SignalRExample.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Agrega servicios al contenedor
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .WithOrigins("http://localhost:4200") // URL de tu frontend
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Permitir credenciales si es necesario
    });
});

var app = builder.Build();

// Configura el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseStaticFiles();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
    endpoints.MapHub<ChatHub>("/chatHub");
});

app.Run();


