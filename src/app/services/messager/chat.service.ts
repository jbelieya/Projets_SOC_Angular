import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket$: WebSocketSubject<any> | undefined;
  private readonly BASE_URL = 'http://127.0.0.1:8000/messager';
  
  private statusSubject = new Subject<any>();
  status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/users/`, { headers: this.getHeaders() });
  }

  getConversation(otherUserId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/conversation/${otherUserId}/`, { headers: this.getHeaders() });
  }

  connectGlobale(id: number): void {
    if (!this.socket$ || this.socket$.closed) {
      const url = `ws://127.0.0.1:8000/ws/notifications/${id}/`;
      this.socket$ = webSocket(url);

      this.socket$.subscribe({
        next: (data: any) => {
          if (data.type === 'status_update') {
            this.statusSubject.next(data);
          }
        },
        error: (err) => console.error('WebSocket Error:', err),
        complete: () => console.warn('WebSocket Connection Closed')
      });
    }
  }

  sendMessage(msg: any): void {
    this.socket$?.next(msg);
  }

  getMessages(): Observable<any> {
    return this.socket$ ? this.socket$.asObservable() : new Subject().asObservable();
  }

  disconnect(): void {
    this.socket$?.complete();
    this.socket$ = undefined;
  }
}