import {Component, OnInit} from '@angular/core';
import {Course, CourseService} from '../services/course/course.service';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-course',
  imports: [
    CdkDropList,
    CdkDrag,
    MatCheckboxModule,
    FormsModule,
    NgForOf,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {
  }

  ngOnInit() {
    this.loadCourses();
  }

  drop(event: CdkDragDrop<string[]>) {

    this.courseService.alterNumeroCourse(this.courses[event.previousIndex].id, this.courses[event.currentIndex].id).subscribe({
      next: () => {
        moveItemInArray(this.courses, event.previousIndex, event.currentIndex);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  check(event: MatCheckboxChange, id: number) {
    if (event.source.checked) {
      const index = this.courses.findIndex((course) => course.id === id);
      if (index !== -1) {
        const item = this.courses.splice(index, 1)[0];
        this.courses.push(item);
        item.checked = true;
        this.courseService.updateCourses(item.id, item).subscribe({
          next: () => {
            console.log("Course updated");
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    } else {
      const index = this.courses.findIndex((course) => course.id === id);
      console.log(index)
      if (index !== -1) {
        // Retirer l'élément
        const item = this.courses.splice(index, 1)[0];

        // Mettre à jour le flag checked
        item.checked = false;

        // Trouver l'index de la dernière course avec checked = false
        const lastUncheckedIndex = this.courses
          .map((course, idx) => (!course.checked ? idx : -1))
          .filter(idx => idx !== -1)
          .pop() ?? -1;

        // Insérer l'élément après la dernière course avec checked = false
        if (lastUncheckedIndex !== -1) {
          this.courses.splice(lastUncheckedIndex + 1, 0, item);
        } else {
          this.courses.unshift(item); // Si aucune course avec checked = false
        }
        this.courseService.updateCourses(item.id, item).subscribe({
          next: () => {
            console.log("Course updated");
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    }
  }

  newCourse(newCourseItemNom: HTMLInputElement, newCourseItemQuantite: HTMLInputElement) {
    this.courseService.createCourse(newCourseItemNom.value, newCourseItemQuantite.value).subscribe({
      next: () => {
        this.loadCourses()
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((response: any) => {
      this.courses = response.map((course: Course) => ({
        ...course,
      }));
      this.courses.sort((a, b) => {
        // Trier par checked (false en premier)
        if (a.checked === b.checked) {
          // Si les deux ont la même valeur pour "checked", trier par numero
          return a.numero - b.numero;
        }
        return a.checked ? 1 : -1; // false avant true
      });
      console.log(this.courses)
    });
  }

}
