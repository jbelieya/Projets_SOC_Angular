import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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
  isVerifyingEmail = false; // Nouvelle state
  verificationCode = ''; // Code binding
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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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

  // --- Helper Functions ---
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

  // --- Actions ---
  onLogin() {
    this.loginErrorMessage = '';
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => { console.log("Login Success");
           this.isLoading = false;
           localStorage.setItem('access_token', res.access); // Save token
          this.checkProfileStatus(); // Check Approval
           },
        error: (err) => { this.loginErrorMessage = "Invalid username or password.";
           this.isLoading = false;
           }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
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
          this.isVerifyingEmail = true; // Switch view to Code input
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
        localStorage.setItem('access_token', res.access); // Save token
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
        // Ken 'is_approved' wela 'is_active' true -> Dashboard
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