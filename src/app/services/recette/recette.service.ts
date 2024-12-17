import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Subject, tap} from 'rxjs';
import {MessageService} from '../message/message.service';

export interface Ingredient {
  id?: number;
  nom: string;
  quantite: string;
}

export interface Recette {
  id: number;
  nom: string;
  description: string;
  imageFilename: string;
  imageUrl: string;
  ingredients: Ingredient[];
}

@Injectable({
  providedIn: 'root',
})
export class RecetteService {

  private recettesSubject = new Subject<Recette[]>();
  recettes$ = this.recettesSubject.asObservable();
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  getRecetteById(id: number) {
    return this.http.get<Recette>(`${this.API_URL}/recette/${id}`);
  }

  public getRecettes() {
    this.http.get<Recette[]>(this.API_URL+"/recettes")
      .pipe(catchError(error => {
        this.messageService.showMessage({text: 'Aucune recette trouvée', type: 'error'});
        return [];
      }))
      .subscribe(recettesData => {
        this.recettesSubject.next(recettesData);
      });
  }

  public getDetail(id: number) {
    return this.http.get("http://localhost:8080/recette/" + id);
  }

  public getImage(id: number) {
    const timestamp = new Date().getTime();
    return `http://localhost:8080/${id}/image?t=${timestamp}`;
  }

  public createRecette(recette: any, file: File) {
    delete recette.file;

    const formData = new FormData();
    formData.append('recette', JSON.stringify(recette));
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>("http://localhost:8080/recette", formData, {headers});
  }

  public updateRecette(id: number, recette: any, file: File) {
    delete recette.file;
    recette.id = id;
    const formData = new FormData();

    formData.append('recette', JSON.stringify(recette));
    formData.append('file', file);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put<any>("http://localhost:8080/recette", formData, {headers})
      .pipe(
        tap(() => {
          // Rafraîchir la liste des recettes après la mise à jour
          this.getRecettes();
        })
      );
  }


  public deleteRecette(id: number) {
    return this.http.delete("http://localhost:8080/recette/" + id)
      .pipe(
        tap(() => {
          // Rafraîchir la liste des recettes après la suppression
          this.getRecettes();
        })
      );
  }
}
