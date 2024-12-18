import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Recette, RecetteService} from '../../services/recette/recette.service';
import {MessageService} from '../../services/message/message.service';

@Component({
  selector: 'app-update',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    NgIf
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {
  recetteForm: FormGroup;
  selectedFile!: File;
  formError: boolean = false;
  errors: string = "";
  recette: any;

  constructor(
    private formBuilder: FormBuilder,
    private recetteService: RecetteService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute) {
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

  ngOnInit() {
    this.recetteService.getRecetteById(this.route.snapshot.params["id"]).subscribe((data: any) => {
      this.recette = data;
      this.recetteForm.patchValue({
        nom: data.nom,
        description: data.description,
        // file: data.imageFilename
      });
      if (data.ingredients > 0) {
        data.ingredients.forEach((ingredient: { nom: string; quantite: string }) => {
          this.ingredients.push(this.formBuilder.group({
            nom: ingredient.nom,
            quantite: ingredient.quantite,
          }));
        });
      }
    });
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
    const inputElement = event.target as HTMLInputElement; // Type assertion
    if (inputElement && inputElement.files) {
      this.selectedFile = inputElement.files[0];
    }
  }

  deleteIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  getImageUrl(recette: Recette) {
    return this.recetteService.getImage(recette.id);
  }

  onSubmit() {
    this.recetteService.updateRecette(this.recette.id, this.recetteForm.value, this.selectedFile).subscribe({
      next: response => {
        console.log(response)
        this.messageService.showMessage({text: 'Recette modifiée avec succès', type: 'success', duration: 3000});
        this.router.navigate(['/recettes']);
      },
      error: error => {
        this.formError = true;
        this.errors = error;
      },
    });
  }
}
