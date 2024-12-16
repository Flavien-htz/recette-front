import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Subject } from 'rxjs';

export interface Recette {
  id: number;
  nom: string;
  description: string;
  imageFilename: string;
  ingredients: any[];
}

@Injectable({
  providedIn: 'root',
})
export class RecetteService {

  private recettesSubject = new Subject<Recette[]>();
  recettes$ = this.recettesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRecetteById(id: number) {
    return this.http.get<Recette>("http://localhost:8080/recette/" + id);
  }

  public getRecettes() {
    this.http.get<Recette[]>("http://localhost:8080/recettes")
      .pipe(catchError(error => {
        console.error('Error fetching recipes:', error);
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
    return "http://localhost:8080/" + id + "/image";
  }

  public createRecette(recette: any, file: File) {
    delete recette.file;

    const formData = new FormData();
    formData.append('recette', JSON.stringify(recette));
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>("http://localhost:8080/recette", formData, { headers });
  }
}
