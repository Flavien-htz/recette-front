import {Component, EventEmitter} from '@angular/core';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import {RecetteService} from '../../services/recette/recette.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MessageService} from '../../services/message/message.service';

@Component({
  standalone: true,
  selector: 'app-new',
  imports: [
    CommonModule,
    NgForOf,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {

  recetteForm: FormGroup;
  selectedFile!: File;
  formError: boolean = false;
  errors: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private recetteService: RecetteService,
    private router: Router,
    private messageService: MessageService) {
      this.recetteForm = this.formBuilder.group({
        nom: ['', Validators.required],
        description: [''],
        file: ['', Validators.required],
        ingredients: this.formBuilder.array([
          this.formBuilder.group({
            quantite: ['', Validators.required],
            nom: ['', Validators.required],
          })
        ]),
      })
  }


  get ingredients() {
    return this.recetteForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.formBuilder.group({
      nom: '',
      quantite: '',
      unite: ''
    }));
  }

  onImagePicked(event: Event) {
    // @ts-ignore
    this.selectedFile = event.target['files'][0];
  }

  deleteIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  onSubmit() {

    this.recetteService.createRecette(this.recetteForm.value, this.selectedFile).subscribe({
      next: response => {
        this.messageService.changeMessage('Recette créée avec succès');

        this.router.navigate(['/recettes']);
      },
      error: error => {
        this.formError = true;
        this.errors = error;
      },
    });
  }

}
