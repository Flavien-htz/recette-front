import {Component, OnInit} from '@angular/core';
import {Recette, RecetteService} from '../../services/recette/recette.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgForOf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [
    RouterLink,
    NgForOf,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {

  recette: Recette = {
    id: 0,
    nom: '',
    description: '',
    imageFilename: '',
    ingredients: []
  };

  constructor(private recetteService: RecetteService, private route: ActivatedRoute) {
  }

  ngOnInit() {
      this.recetteService.getDetail(this.route.snapshot.params['id']).subscribe((data: any) => {
      // console.log(data)
      if (data) {
        this.recette = data;
      }
    });
  }

  getImageUrl(recette: Recette) {
    return this.recetteService.getImage(recette.id);
  }
}
