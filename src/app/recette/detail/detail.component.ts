import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {Recette, RecetteService} from '../../services/recette/recette.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgForOf, NgIf, AsyncPipe} from '@angular/common';
import {Observable, map, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from './dialog/delete/delete.component';

@Component({
  selector: 'app-detail',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent {

  private readonly recetteService = inject(RecetteService);
  private readonly route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);


  recette$: Observable<Recette> = this.route.params.pipe(
    map(params => params['id']),
    switchMap(id => this.recetteService.getRecetteById(id)),
    map(recette => ({
      ...recette,
      imageUrl: this.recetteService.getImage(recette.id)
    }))
  )

  openDialog(recette:Recette) {
    this.dialog.open(DeleteComponent, {
      data: {
        id: recette.id,
      },
    });
  }
}
