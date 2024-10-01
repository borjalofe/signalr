import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

import { SignalrService } from '@services/signalr';

interface Message {
  timestamp: string;
  user: string;
  message: string;
}

interface Notification {
  timestamp: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ChatComponent implements OnInit {
  userName: string = '';
  message: string = '';

  notificationTitle: string = '';
  notificationContent: string = '';

  messages$: Observable<Message[]>;
  notifications$: Observable<Notification[]>;
  connectionState$: Observable<signalR.HubConnectionState>;

  errorMessage: string = '';

  connectionClasses = {
    'text-success': signalR.HubConnectionState.Connected,      // 1
    'text-warning': signalR.HubConnectionState.Reconnecting,   // 2
    'text-danger': signalR.HubConnectionState.Disconnected    // 4
  };


  constructor(private signalrService: SignalrService) {
    this.messages$ = this.signalrService.messages$;
    this.notifications$ = this.signalrService.notifications$;
    this.connectionState$ = this.signalrService.connectionState$;
  }

  ngOnInit(): void {
  }

  sendMessage() {
    if (this.userName.trim() && this.message.trim()) {
      if (this.signalrService['hubConnection'].state === signalR.HubConnectionState.Connected) {
        this.signalrService.sendMessage(this.userName, this.message);
        this.message = '';
      } else {
        this.errorMessage = 'No se puede enviar el mensaje. La conexión no está establecida.';
      }
    }
  }

  sendNotification() {
    if (this.notificationTitle.trim() && this.notificationContent.trim()) {
      if (this.signalrService['hubConnection'].state === signalR.HubConnectionState.Connected) {
        this.signalrService.sendNotification(this.notificationTitle, this.notificationContent);
        this.notificationTitle = '';
        this.notificationContent = '';
      } else {
        this.errorMessage = 'No se puede enviar la notificación. La conexión no está establecida.';
      }
    }
  }
}
