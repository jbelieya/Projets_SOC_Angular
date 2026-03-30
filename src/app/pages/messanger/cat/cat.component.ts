import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/messager/chat.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Zid hedhom
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cat',
  standalone: true, // Madem testa3mel f-imports direct
  imports: [CommonModule, NgClass, FormsModule],
  templateUrl: './cat.component.html',
  styleUrls: ['./cat.component.css']
})
export class CatComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: any = null;

  constructor(
    private chatService: ChatService, 
    private http: HttpClient,
    private authService: AuthService // Zid el authService hna
  ) {}
  ngOnInit() {
this.currentUserId = Number(this.authService.getCurrentUserId());    this.loadUsers();    // 2. Jib el lesta mte3 el analysts
    
    // 3. Connecti lel WebSocket
    this.chatService.connect('soc_main_room');
    
    this.chatService.getMessages().subscribe(msg => {
      this.messages.push(msg);
    });
  }

  

  loadUsers() {
    // AHAM 7AJA: Lezem nafs el key 'access_token' kima f-el AuthService
    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` // Madem testa3mel f-JWT, lezem 'Bearer'
      });

      this.http.get('http://127.0.0.1:8000/messager/users/', { headers }).subscribe({
        next: (data: any) => {
          this.users = data;
          console.log('Analysts loaded successfully:', data);
        },
        error: (err) => {
          console.error('Error 401 or 403: Check if the token is valid', err);
        }
      });
    } else {
      console.error('No access_token found! Please login again.');
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    // Optional: jareb efreg el messages ki tbedel el user
    // this.messages = []; 
  }

  send() {
    if (this.newMessage.trim() && this.selectedUser) {
      const packet = {
        message: this.newMessage,
        sender_id: this.currentUserId,
        receiver_id: this.selectedUser.id
      };
      this.chatService.sendMessage(packet);
      this.newMessage = '';
    }
  }
}