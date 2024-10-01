using Microsoft.AspNetCore.Mvc;

namespace SignalRExample.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            // Devolver el archivo HTML ubicado en wwwroot
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/html");
        }
    }
}
