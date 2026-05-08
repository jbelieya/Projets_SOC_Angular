import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  userProfile: any = null;
  currentUserId!: number;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Récupération de l'ID via le service d'authentification
    this.currentUserId = +this.authService.getCurrentUserId()!;
    
    // Abonnement au flux de l'utilisateur connecté pour avoir ses données en temps réel
    this.authService.currentUser$.subscribe(user => {
      this.userProfile = user;
    });
    
    // Forcer la mise à jour des données du profil
    this.authService.refreshProfile();
  }

  // Génère une couleur unique basée sur l'ID de l'utilisateur
  getHue(id: number): number {
    return (id * 137.5) % 360;
  }
}