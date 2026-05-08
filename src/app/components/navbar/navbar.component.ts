import { CommonModule, NgClass } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { ChatService } from '../../services/messager/chat.service';
import { FormsModule } from '@angular/forms';

@Pipe({ name: 'usersFilter1', standalone: true })
export class UsersFilterPipee implements PipeTransform {
  transform(users: any[], query: string): any[] {
    if (!query?.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(u => u.username.toLowerCase().includes(q));
  }
}
@Component({
  selector: 'app-navbar',
  imports: [NgClass, CommonModule, FormsModule,UsersFilterPipee],
  templateUrl:'./navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, AfterViewChecked{
    @ViewChild('scrollArea') private scrollArea!: ElementRef;

isMenuOpen = false; 
userProfile: any = null;
isMessengerOpen = false;
  activeChatUser: any = null; 
  users: any[] = [];
  currentUserId!: number;
  private msgSub?: Subscription;
  selectedUser: any = null;
  messages: any[]     = [];
  newMessage: string  = '';
  searchQuery: string = '';
  chatMessage: string = '';
   private shouldScroll = false;
    wsConnected: boolean = false;
  inputFocused: boolean = false;
  isTyping: boolean    = false;
  new: boolean = false;
  private statusSubscription?: Subscription;
  private statusMap: Map<number, boolean> = new Map();
  private msgSubscription?: Subscription;
  private lastMsgMap: Map<number, string> = new Map(); // userId -> last msg
  private hues = [210, 160, 340, 45, 270, 30, 190];
  private unreadMap: Map<number, number> = new Map();
 currentUserIde!: string | null;
 private isInitialLoad = true;
constructor(private authService: AuthService,
   private eRef: ElementRef,
   private router: Router,
   private chatService: ChatService,) {}
  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnInit() {
  this.currentUserId = Number(this.authService.getCurrentUserId());
  this.authService.currentUser$.subscribe(user => {
    this.userProfile = user;
  });
    this.currentUserIde = this.authService.getCurrentUserId();

  this.authService.refreshProfile();
    this.chatService.connectGlobale(this.currentUserId);
   this.wsConnected = true;
    this.statusSubscription = this.chatService.status$.subscribe(data => {
      console.log("Status Received from WS:", data); 
      if (data.user_id) {
        this.statusMap.set(Number(data.user_id), data.status === 'online');
        this.users = [...this.users]; 
      }
    });
    
   
    this.checknewMessage(); 
 
  }
  checknewMessage(){
     this.msgSubscription = this.chatService.getMessages().subscribe({
      next: (msg: any) => {
        if (!msg.message || !msg.sender_id) return;
        const senderId = Number(msg.sender_id);
        const receiverId = Number(msg.receiver_id);

        const partnerId = (senderId === this.currentUserId) ? receiverId : senderId;
        this.setLastMsg(partnerId, msg.message);
        console.log()
        if (senderId !== this.currentUserId && (!this.selectedUser || this.selectedUser.id !== senderId)) {
      const currentCount = this.unreadMap.get(senderId) || 0;
      this.unreadMap.set(senderId, currentCount + 1);
      this.new = true;
    } 
        if (this.selectedUser && (senderId === this.selectedUser.id || (senderId === this.currentUserId && receiverId === this.selectedUser.id))) {
const isDuplicate = this.messages.some(m => 
        m.message === msg.message && 
        m.sender_id === senderId && 
        Math.abs(new Date(m.sent_date).getTime() - new Date(msg.sent_date).getTime()) < 1000 
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
    if (this.wsConnected == null){
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
        Math.abs(new Date(m.sent_date).getTime() - new Date(msg.sent_date).getTime()) < 1000 
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
     this.loadUsers();
     this.wsConnected=true;
    }
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
  openChat(user: any) {
    this.selectedUser = user;
    this.activeChatUser = user;
    this.isMessengerOpen = false; 
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
    getLastMsg(userId: number): string {
    return this.lastMsgMap.get(userId) || '';
  }
  showDateSep(index: number): boolean {
    if (index === 0) return false;
    const curr = this.messages[index];
    const prev = this.messages[index - 1];
    if (!curr?.sent_date || !prev?.sent_date) return false;
    return new Date(curr.sent_date).getTime() - new Date(prev.sent_date).getTime() > 5 * 60 * 1000;
  }
   setLastMsg(userId: number, msg: string): void {
  this.lastMsgMap.set(userId, msg);
  this.users = [...this.users];
}
  getHue(id: number) {
    return (id * 137.5) % 360; 
  }

  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; 
  }
  onLogout() {
   this.isMenuOpen = false;
  this.authService.logout().subscribe({
    next: () => {
      this.chatService.disconnect();
      this.msgSubscription?.unsubscribe();
      this.wsConnected=false;
      this.userProfile = null; 
      this.router.navigate(['/login']);
    },
    error: () => {
      
      localStorage.clear();
      this.userProfile = null;
      this.router.navigate(['/login']);
    }
  });
  }
   private scrollToBottom(): void {
    try {
      const el = this.scrollArea?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
  @HostListener('document:click', ['$event'])
  clickout(event: any) {

  if (!this.eRef.nativeElement.contains(event.target)) {
    this.isMenuOpen = false;
  }
}
get totalUnreadCount(): number {
  let total = 0;
  this.unreadMap.forEach((count) => {
    total += count;
  });
  return total;
}
}
