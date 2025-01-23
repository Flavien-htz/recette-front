import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs';

export interface Course {
  id: number;
  nom: string;
  quantite: string;
  numero: number;
  checked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }


  public getCourses() {
    return this.http.get<any>(this.API_URL + "/courses")
  }

  public updateCourses(id:number, course:any) {
    course.id = id;
    const formData = new FormData();

    formData.append('course', JSON.stringify(course));

    return this.http.put<any>("http://localhost:8080/course/"+id, formData)
      .pipe(
        tap(() => {
          // Rafraîchir la liste des recettes après la mise à jour
          this.getCourses();
        })
      );
  }

  public alterNumeroCourse(id1: number, id2:number){
    const formData = new FormData();
    formData.append('course1', JSON.stringify(id1));
    formData.append('course2', JSON.stringify(id2));
    return this.http.put<any>("http://localhost:8080/course/alterNumeroMenu", formData)
  }

  public createCourse(courseNom: any, courseQuantite: any) {
    let course = {
      nom: courseNom,
      quantite: courseQuantite
    }
    const formData = new FormData();
    formData.append('course', JSON.stringify(course));
    return this.http.post(this.API_URL + "/course", formData)
  }

}
