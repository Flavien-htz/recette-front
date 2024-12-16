import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSource = new BehaviorSubject<string | null>(null);

  // Observable exposé
  currentMessage$ = this.messageSource.asObservable();

  // Méthode pour mettre à jour le message
  changeMessage(message: string|null) {
    this.messageSource.next(message);
  }
}
