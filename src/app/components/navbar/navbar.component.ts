import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
isMenuOpen = false; // Par défaut el menu msakkar
userProfile: any = null;
constructor(private authService: AuthService, private eRef: ElementRef,private router: Router) {}

  ngOnInit() {
   this.authService.currentUser$.subscribe(user => {
    this.userProfile = user;
  });

  // 2. Jib el data awel ma t-7el l-app
  this.authService.refreshProfile();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // T-baddel 7al el menu (ken m-7el t-sakrou, ken m-sakkar t-7ellou)
  }
  onLogout() {
   this.isMenuOpen = false;
  this.authService.logout().subscribe({
    next: () => {
      // N-farghou el userProfile f-el component bch el navbar t-welli fergha
      this.userProfile = null; 
      this.router.navigate(['/login']);
    },
    error: () => {
      // Hatta ken fama error (kima token expiré), n-fasi5 el localStorage w n-kharjouh
      localStorage.clear();
      this.userProfile = null;
      this.router.navigate(['/login']);
    }
  });
  }
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
  // Ken el click sar barra el component mta' l-navbar, sakker el menu
  if (!this.eRef.nativeElement.contains(event.target)) {
    this.isMenuOpen = false;
  }
}
}
