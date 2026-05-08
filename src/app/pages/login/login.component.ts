import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/messager/chat.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  imports:  [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;
  registerForm: FormGroup;
  userEmailForVerification: string = '';
  showPassword = false;
  isRegisterMode = false;
  isLoginMode = true;
  isLoading = false;
  isVerifyingEmail = false;
  verificationCode = ''; 
  roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'ANALYSTE_N1', label: 'Analyste Niveau 1' },
    { value: 'ANALYSTE_N2', label: 'Analyste Niveau 2' },
    { value: 'manager', label: 'Manager SOC' },
  ];

  errorMessage: string = '';
  successMessage: string = '';
  loginErrorMessage: string = '';
  errors: any = {}; 
  currentUserId!: number;
  isMessengerOpen = false;
  activeChatUser: any = null; 
  users: any[] = [];
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
  private lastMsgMap: Map<number, string> = new Map(); 
  private hues = [210, 160, 340, 45, 270, 30, 190];
  private unreadMap: Map<number, number> = new Map();
 private isInitialLoad = true;
  constructor(private fb: FormBuilder,
     private authService: AuthService,
      private router: Router,
    private chatService: ChatService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      password: ['', [Validators.required, Validators.minLength(9)]],
      role: ['ANALYSTE_N1', Validators.required]
    });
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.hasError('required')) return 'Ce champ est obligatoire.';
    if (control?.hasError('email')) return 'Format email invalide.';
    if (control?.hasError('minlength')) return 'Minimum 9 caractères.';
    return '';
  }

  onLogin() {
    this.loginErrorMessage = '';
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => { console.log("Login Success");
           this.isLoading = false;
           this.currentUserId = Number(this.authService.getCurrentUserId());
          this.chatService.connectGlobale(this.currentUserId);
           localStorage.setItem('access_token', res.access); 
          this.checkProfileStatus(); 
          
           },
        error: (err) => { this.loginErrorMessage = "Invalid username or password.";
           this.isLoading = false;
           }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
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
setLastMsg(userId: number, msg: string): void {
  this.lastMsgMap.set(userId, msg);
  this.users = [...this.users];
}
  onRegister() {
    this.isLoginMode = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.errors = {};

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.userEmailForVerification = this.registerForm.get('email')?.value;
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isRegisterMode = false;
          this.isLoginMode = false;
          this.isVerifyingEmail = true; 
          this.successMessage = "Account created! Please enter the code sent to your email.";
          this.registerForm.reset({ role: 'ANALYSTE_N1' });
          this.isLoading = false;
        },
        error: (err) => {
          if (err.status === 400) this.errors = err.error;
          this.errorMessage = "Veuillez corriger les erreurs.";
          this.isLoading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  onVerifyCode() {
    this.isLoading = true;
    this.authService.verifieremail(this.userEmailForVerification, this.verificationCode).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access); 
        this.checkProfileStatus();
      },
      error: () => {
        alert("Code Ghalet! Réessayez.");
        this.isLoading = false;
      }
    });
  }
  checkProfileStatus() {
    this.authService.getProfile().subscribe({
      next: (profile: any) => {
        if (profile.is_approved || profile.is_verified) { 
          this.router.navigate(['/app/incidents']); 
        } else {
          alert("Compte en attente d'approbation par l'admin.");
          this.isLoading = false;
        }
      },
      error: () => { this.errorMessage = "Error fetching profile."; this.isLoading = false;this.isLoginMode = true;this.isVerifyingEmail = false;}
    });
  }
}