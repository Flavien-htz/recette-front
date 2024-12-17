import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {RecetteService} from '../../../../services/recette/recette.service';
import {MessageService} from '../../../../services/message/message.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete',
  imports: [
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  data = inject(MAT_DIALOG_DATA);
  recetteService = inject(RecetteService);
  messageService = inject(MessageService);
  router = inject(Router);


  delete(recette: any){
      this.recetteService.deleteRecette(recette.id).subscribe({
        next: response => {
          this.messageService.showMessage({text: 'Recette supprimée avec succès', type: 'success'});
          this.router.navigate(['/recettes']);
        },
        error: error => {
          /* TODO handle error */
        },
      });
  }

}
