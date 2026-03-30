import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://127.0.0.1:8000/todo/ai-advisor/';

  constructor() { }

  // N-badlouha "async" bech n-najmou n-a9raw el stream
  async askAiStream(type: string, description: string, onChunk: (text: string) => void) {
    const token = localStorage.getItem('access_token');

    // 1. El call mte3 el API testa3mel fetch f-blasat HttpClient
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type, description })
    });

    if (!response.ok) {
      throw new Error('Mochkla fel connection mel backend');
    }

    // 2. N-7allou el Reader mte3 el stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      // 3. El kelma elli tji mel AI, n-ba3thouha direct lel Component
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk); 
    }
  }
}