import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Pipe, PipeTransform } from '@angular/core';
import { ChatService } from '../../../services/messager/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

/* ── Pipe pour filter el users par nom ── */
@Pipe({ name: 'usersFilter', standalone: true })
export class UsersFilterPipe implements PipeTransform {
  transform(users: any[], query: string): any[] {
    if (!query?.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(u => u.username.toLowerCase().includes(q));
  }
}

@Component({
  selector: 'app-cat',
  standalone: true,
  imports: [CommonModule, FormsModule, UsersFilterPipe],
  templateUrl: './cat.component.html',
  styleUrls: ['./cat.component.css']
})
export class CatComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scrollArea') private scrollArea!: ElementRef;

  users: any[]        = [];
  selectedUser: any   = null;
  messages: any[]     = [];
  newMessage: string  = '';
  searchQuery: string = '';
  currentUserId!: number;
  wsConnected: boolean = false;
  inputFocused: boolean = false;
  isTyping: boolean    = false;
  private statusSubscription?: Subscription;
private statusMap: Map<number, boolean> = new Map();
  private msgSubscription?: Subscription;
  private lastMsgMap: Map<number, string> = new Map(); // userId -> last msg
  private hues = [210, 160, 340, 45, 270, 30, 190];
  private shouldScroll = false;
private unreadMap: Map<number, number> = new Map();
  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = Number(this.authService.getCurrentUserId());
    
    this.chatService.connectGlobale(this.currentUserId);
    this.wsConnected = true;
   this.statusSubscription = this.chatService.status$.subscribe(data => {
      console.log("Status Received from WS:", data); 
      if (data.user_id) {
        this.statusMap.set(Number(data.user_id), data.status === 'online');
        this.users = [...this.users]; 
      }
    });
    this.msgSubscription = this.chatService.getMessages().subscribe({
      next: (msg: any) => {
        const senderId = Number(msg.sender_id);
        const receiverId = Number(msg.receiver_id);

        const partnerId = (senderId === this.currentUserId) ? receiverId : senderId;
        this.setLastMsg(partnerId, msg.message);
        if (senderId !== this.currentUserId && (!this.selectedUser || this.selectedUser.id !== senderId)) {
      const currentCount = this.unreadMap.get(senderId) || 0;
      this.unreadMap.set(senderId, currentCount + 1);
    }
        if (this.selectedUser && (senderId === this.selectedUser.id || (senderId === this.currentUserId && receiverId === this.selectedUser.id))) {
const isDuplicate = this.messages.some(m => 
        m.message === msg.message && 
        m.sender_id === senderId && 
        Math.abs(new Date(m.sent_date).getTime() - new Date(msg.sent_date).getTime()) < 1000 // فرق أقل من ثانية
      );          
          if (!isDuplicate) {
            this.messages.push({
              message: msg.message,
              sender_id: senderId,
              receiver_id: receiverId,
              sent_date: msg.sent_date
            });
            this.shouldScroll = true;
          }
        }
      }
    });

    // 3. Load users
    this.loadUsers();
  }

  loadUsers() {
  this.chatService.getUsers().subscribe(data => {
    this.users = (Array.isArray(data) ? data : (data as any).results || [])
                 .filter((u: any) => u.id !== this.currentUserId);

    this.users.forEach(u => {
      
      this.statusMap.set(u.id, u.is_online || false);
      this.users = [...this.users];
      this.chatService.getConversation(u.id).subscribe(h => {
        if (h?.length > 0) {
          this.setLastMsg(u.id, h[h.length - 1].textContent || h[h.length - 1].message);
        }
      });
    });

    this.users = [...this.users];
  });
}
isOnline(userId: number): boolean {
  return this.statusMap.get(userId) || false;
}
  selectUser(user: any): void {
    this.selectedUser = user;
    this.unreadMap.set(user.id, 0);
    this.messages = [];
    
    this.chatService.getConversation(user.id).subscribe({
      next: (history: any[]) => {
        this.messages = history.map(m => ({
          message: m.textContent || m.message,
          sender_id: Number(m.sender),
          receiver_id: Number(m.receiver),
          sent_date: m.sent_date
        }));
        this.shouldScroll = true;
      }
    });
  }
getUnreadCount(userId: number): number {
  return this.unreadMap.get(userId) || 0;
}
  send(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const packet = {
      message: this.newMessage,
      sender_id: this.currentUserId,
      receiver_id: this.selectedUser.id,
      sent_date: new Date().toISOString()
    };

    this.chatService.sendMessage(packet);
    
    this.messages.push({ ...packet });
    this.setLastMsg(this.selectedUser.id, this.newMessage);
    this.shouldScroll = true;
    this.newMessage = '';
  }
  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  /* ── Hue lel avatar (stable per user id) ── */
  getHue(userId: number): number {
    return this.hues[userId % this.hues.length];
  }

  /* ── Last message f-sidebar ── */
  getLastMsg(userId: number): string {
    return this.lastMsgMap.get(userId) || '';
  }

  /* ── Show date separator (ki yb3ed akther mn 5 min) ── */
  showDateSep(index: number): boolean {
    if (index === 0) return false;
    const curr = this.messages[index];
    const prev = this.messages[index - 1];
    if (!curr?.sent_date || !prev?.sent_date) return false;
    return new Date(curr.sent_date).getTime() - new Date(prev.sent_date).getTime() > 5 * 60 * 1000;
  }

  /* ── Scroll lel bottom ── */
  private scrollToBottom(): void {
    try {
      const el = this.scrollArea?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
  setLastMsg(userId: number, msg: string): void {
  this.lastMsgMap.set(userId, msg);
  this.users = [...this.users];
}
  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.msgSubscription?.unsubscribe();
  }
}