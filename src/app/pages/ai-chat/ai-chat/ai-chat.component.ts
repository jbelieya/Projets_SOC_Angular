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
    { text: 'Bonjour! Comment puis-je vous aider?', isAi: true }
  ];
  isLoading = false;

  constructor(private aiService: AiService) {}

  toggleChat() { this.isOpen = !this.isOpen; }

  async sendMessage() { 
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.messages.push({ text: userMsg, isAi: false });
    this.userInput = '';
    this.isLoading = true;

    const aiMessageIndex = this.messages.length;
    this.messages.push({ text: '', isAi: true });

    try {
      await this.aiService.askAiStream("", userMsg, (chunk) => {
        this.messages[aiMessageIndex].text += chunk;
        this.isLoading = false; 
      });
    } catch (err) {
      console.error(err);
      this.messages[aiMessageIndex].text = "Erreur: Verifiez que Ollama est lancé.";
      this.isLoading = false;
    }
  }
}