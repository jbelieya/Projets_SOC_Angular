import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userProfile: any = null;
  currentUserId: string | null = null;
constructor(private authService: AuthService, private eRef: ElementRef,private router: Router) {}

  ngOnInit() {
   this.authService.currentUser$.subscribe(user => {
    this.userProfile = user;
  });
    this.currentUserId = this.authService.getCurrentUserId();

  // 2. Jib el data awel ma t-7el l-app
  this.authService.refreshProfile();
  }

  getHue(id: number): number {
    return (id * 137.5) % 360;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
