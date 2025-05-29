export interface Model {
    id: string;
    nome: string;
    status: 'online' | 'offline' | 'slow';
    responseTime?: number;
    lastChecked?: string;
  }
  
  export interface ChatMessage {
    type: 'question' | 'answer';
    content: string;
    model?: string;
  }
  
  export interface ChatSession {
    id: number;
    history: ChatMessage[];
    title: string;
    timestamp: number;
  }