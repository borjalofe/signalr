import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private BACKEND_URL: string = 'http://localhost:8080/chatHub';
  private hubConnection!: signalR.HubConnection;

  private connectionStateSubject = new BehaviorSubject<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
  public connectionState$ = this.connectionStateSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {
    this.startConnection();
    this.addReceiveMessageListener();
    this.addReceiveNotificationListener();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.BACKEND_URL)
      .withAutomaticReconnect()
      .build();
  
    this.hubConnection.onclose(error => {
      console.error(`Connection closed: ${error}`);
      this.connectionStateSubject.next(signalR.HubConnectionState.Disconnected);
    });
  
    this.hubConnection.onreconnecting(error => {
      console.warn(`Connection lost due to error "${error}". Reconnecting.`);
      this.connectionStateSubject.next(signalR.HubConnectionState.Reconnecting);
    });
  
    this.hubConnection.onreconnected(connectionId => {
      console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
      this.connectionStateSubject.next(signalR.HubConnectionState.Connected);
    });
  
    this.hubConnection
      .start()
      .then(() => {
        console.log('Conexión iniciada con SignalR');
        this.connectionStateSubject.next(signalR.HubConnectionState.Connected);
      })
      .catch(err => console.error('Error al iniciar la conexión: ' + err));
  }

  private addReceiveMessageListener() {
    this.hubConnection.on('ReceiveMessage', (response: Message) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, response]);
    });
  }

  private addReceiveNotificationListener() {
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([...currentNotifications, notification]);
    });
  }

  public sendMessage(user: string, message: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', user, message)
        .catch(err => console.error(err.toString()));
    } else {
      console.warn('Cannot send message. The connection is not in the Connected state.');
    }
  }

  public sendNotification(title: string, content: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendNotification', title, content)
        .catch(err => console.error(err.toString()));
    } else {
      console.warn('Cannot send notification. The connection is not in the Connected state.');
    }
  }
}
