using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRExample.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            var response = new
            {
                User = user,
                Message = message,
                Timestamp = DateTime.Now
            };

            await Clients.All.SendAsync("ReceiveMessage", response);
        }

        public async Task SendNotification(string title, string content)
        {
            var notification = new
            {
                Title = title,
                Content = content,
                Timestamp = DateTime.Now
            };

            await Clients.All.SendAsync("ReceiveNotification", notification);
        }
    }
}

