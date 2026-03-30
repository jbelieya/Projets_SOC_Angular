import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket$: WebSocketSubject<any> | undefined;
  private readonly API_URL = 'http://127.0.0.1:8000/messager/users/';

  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // Jib el Analysts mel DB
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL, { headers: this.getHeaders() });
  }

  // El WebSocket connection (kima 3malna l-bera7)
  connect(roomName: string): void {
    this.socket$ = webSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
  }

  sendMessage(msg: any) {
    this.socket$?.next(msg);
  }

  getMessages(): Observable<any> {
    return this.socket$!.asObservable();
  }
}