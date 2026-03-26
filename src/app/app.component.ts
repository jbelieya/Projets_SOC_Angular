import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu/menu.component';
import { CommonModule } from '@angular/common';
import { AiChatComponent } from './pages/ai-chat/ai-chat/ai-chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,MenuComponent,CommonModule,AiChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SOC_Prp';
collapsed = signal(false);

}
