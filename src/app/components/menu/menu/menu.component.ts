import { CommonModule } from '@angular/common';
import { Component, effect, model, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Salla7 el import hedha
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true, // Zidha bch t-koun sûr
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule,RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  collapsed = model.required<boolean>();
  darkMode = signal(false);
   todayDate: Date = new Date();
    currentUserIde!: string | null;
userProfile: any = null;
  currentUserId!: number;

     constructor(private authService: AuthService) {
  } 
ngOnInit(): void {
    this.currentUserId = Number(this.authService.getCurrentUserId());
  this.authService.currentUser$.subscribe(user => {
    this.userProfile = user;
  });
    this.currentUserIde = this.authService.getCurrentUserId();

  this.authService.refreshProfile();
}
  setDarkMode = effect(() => {
    if (this.darkMode()) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  });
}
