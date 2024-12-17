import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSource = new BehaviorSubject<Message | null>(null);
  currentMessage$ = this.messageSource.asObservable();

  showMessage(message: Message) {
    this.messageSource.next(message);
    
    if (message?.duration) {
      setTimeout(() => {
        this.clearMessage();
      }, message.duration);
    }
  }

  clearMessage() {
    this.messageSource.next(null);
  }
}
