import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Recette, RecetteService} from '../services/recette/recette.service';
import {RouterLink} from '@angular/router';
import {MessageService} from '../services/message/message.service';


@Component({
  standalone: true,
  selector: 'app-recette',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './recette.component.html',
  styleUrl: './recette.component.css'
})
export class RecetteComponent implements OnInit, OnDestroy {

  recettes: Recette[] = [];
  message: string | null = '';

  constructor(
    private recetteService: RecetteService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.recetteService.getRecettes().subscribe((data: any) => {
      this.recettes = data;
    });
    this.messageService.currentMessage$.subscribe((message) => {
      this.message = message;
    });
  }

  ngOnDestroy() {
    this.messageService.changeMessage(null);
  }

  getImageUrl(recette: Recette) {
    return this.recetteService.getImage(recette.id);
  }


}
