import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs';
import {Recette} from '../recette/recette.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  public getMenus() {
    return this.http.get<any>(this.API_URL+"/menus")
  }

  formatDateTime(date: Date, time: string): string {
    // Obtenir la partie date au format 'yyyy-MM-dd'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Mois commence à 0
    const day = String(date.getDate()).padStart(2, '0');

    // Construire la chaîne formatée
    return `${year}-${month}-${day} ${time}`;
  }

  public createMenu(menu: any) {
    const formData = new FormData();
    let menuForm = {
      nom: menu.title,
      startDate: this.formatDateTime(menu.date, menu.startTime),
      endDate: this.formatDateTime(menu.date, menu.endTime)
    }
    formData.append('menu', JSON.stringify(menuForm));
    return this.http.post(this.API_URL+"/menu", formData)
  }

  updateMenu(id: string, menuData: any): Observable<any> {
    const formData = new FormData();
    console.log(menuData)
    let menuForm = {
      nom: menuData.title,
      startDate: menuData.startDate,
      endDate: menuData.endDate
    }
    // console.log(menuForm)
    formData.append('menu', JSON.stringify(menuForm));
    return this.http.put(this.API_URL+"/menu/"+id, formData);
  }
}
