import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recette, RecetteService } from '../services/recette/recette.service';
import { RouterLink } from '@angular/router';
import { Message, MessageService } from '../services/message/message.service';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipe/filter.pipe';


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
export class RecetteComponent implements OnInit {
  recettes: Recette[] = [];
  searchQuery: string = '';
  message: Message | null = null;

  constructor(
    private recetteService: RecetteService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.recetteService.getRecettes();
    this.recetteService.recettes$.subscribe(recettes => {
      this.recettes = recettes.map(recette => ({
        ...recette,
        imageUrl: this.getImageUrl(recette) + '?t=' + new Date().getTime()
      }));
    });

    this.messageService.currentMessage$.subscribe((message) => {
      this.message = message;
    });
  }


  getImageUrl(recette: Recette) {
    return this.recetteService.getImage(recette.id);
  }
}
