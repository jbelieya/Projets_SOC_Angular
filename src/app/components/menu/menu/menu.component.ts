import { CommonModule } from '@angular/common';
import { Component, effect, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// menu.component.ts
import { MatIconModule } from '@angular/material/icon'; // Salla7 el import hedha
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true, // Zidha bch t-koun sûr
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule,RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  collapsed = model.required<boolean>();
  darkMode = signal(false);

  setDarkMode = effect(() => {
    // T-thabbat ennou el class 'dark' tetzad lel html
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}
