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

  async sendMessage() { // Zidna "async" hna
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.messages.push({ text: userMsg, isAi: false });
    this.userInput = '';
    this.isLoading = true;

    // 1. Nazidou message feragh lel AI bech n-3abbih kelma b-kelma
    const aiMessageIndex = this.messages.length;
    this.messages.push({ text: '', isAi: true });

    try {
      // 2. N-kallmou el service jdid (eli fih el fetch)
      await this.aiService.askAiStream("Analyse d'incident", userMsg, (chunk) => {
        // Kol ma tji kelma, n-ziduha direct lel message mte3 el AI
        this.messages[aiMessageIndex].text += chunk;
        this.isLoading = false; // N-na7iw el loading mel awel kelma
      });
    } catch (err) {
      console.error(err);
      this.messages[aiMessageIndex].text = "Erreur: Verifiez que Ollama est lancé.";
      this.isLoading = false;
    }
  }
}