import { Component } from '@angular/core';
import { AiService } from '../../../services/ai/ai.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AiChatComponent {
isOpen = false;
  userInput = '';
  messages: { text: string, isAi: boolean }[] = [
    { text: 'Bonjour! Je suis votre assistant SOC. Comment puis-je vous aider?', isAi: true }
  ];
  isLoading = false;

  constructor(private aiService: AiService) {}

  toggleChat() { this.isOpen = !this.isOpen; }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.messages.push({ text: userMsg, isAi: false });
    this.userInput = '';
    this.isLoading = true;

    // Type houni n-najmou n-khalliouh 'General' walla n-jibouh mel Todo
    this.aiService.askAi("Analyse d'incident", userMsg).subscribe({
      next: (res) => {
        this.messages.push({ text: res.suggestion, isAi: true });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ text: "Erreur: Verifiez que Ollama est lancé.", isAi: true });
        this.isLoading = false;
      }
    });
  }
}
