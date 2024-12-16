import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Recette, RecetteService} from '../services/recette/recette.service';
import {RouterLink} from '@angular/router';
import {MessageService} from '../services/message/message.service';
import {FormsModule} from '@angular/forms';
import {FilterPipe} from '../pipe/filter.pipe';


@Component({
  standalone: true,
  selector: 'app-recette',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    FilterPipe
  ],
  templateUrl: './recette.component.html',
  styleUrl: './recette.component.css'
})
export class RecetteComponent implements OnInit, OnDestroy {
  recettes: Recette[] = [];
  searchQuery: string = '';
  message: string | null = '';

  constructor(
    private recetteService: RecetteService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.recetteService.getRecettes();
    this.recetteService.recettes$.subscribe(recettes => {
      this.recettes = recettes;
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
