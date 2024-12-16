import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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

  constructor(private http: HttpClient) {
  }

  getRecetteById(id:number){
    return this.http.get("http://localhost:8080/recette/"+id);
  }

  public getRecettes() {
    return this.http.get("http://localhost:8080/recettes")
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
