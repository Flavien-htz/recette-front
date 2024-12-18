import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogRef, MatDialog,
  MatDialogTitle,
  MatDialogContent, MatDialogActions,
} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';


@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, FormsModule, MatFormField, MatInput, MatLabel, MatOption, MatSelect, ReactiveFormsModule],
  templateUrl: './update-event-dialog.component.html'
})
export class UpdateEventDialogComponent {
  event = {
    title: '',
    startTime: '',
    endTime: '',
    moment: '',
    date: '',
  };

  constructor(
    public dialogRef: MatDialogRef<UpdateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data.date)
    this.event = {
      title: this.data.title,
      startTime: this.data.start,
      endTime: this.data.end,
      moment: this.data.moment,
      date: this.data.date
    }
    const endHour = this.extractTime(this.event.endTime);
    const startHour = this.extractTime(this.event.startTime);
    if (startHour === '12:00' && endHour === '13:00') {
      this.event.moment = 'midi';
    } else if (startHour === '19:00' && endHour === '20:00') {
      this.event.moment = 'soir';
    } else if (startHour === '12:00' && endHour === '20:00') {
      this.event.moment = 'both';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.event.moment === "midi") {
      this.event.startTime = "12:00"
      this.event.endTime = "13:00"
    } else if (this.event.moment === "soir") {
      this.event.startTime = "19:00"
      this.event.endTime = "20:00"
    } else if (this.event.moment === "both") {
      this.event.startTime = "12:00"
      this.event.endTime = "20:00"
    }
    console.log(this.data.date)
    this.event.date = this.data.date;
    this.dialogRef.close({
      ...this.event,
      daysOfWeek: [this.data.dayOfWeek],
      backgroundColor: this.event.startTime.startsWith('12') ? 'green' : 'blue'
    });
  }

  extractTime(dateString: string): string {
    const date = new Date(dateString);  // Convertir la chaîne en objet Date
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;  // Retourne au format HH:mm
  }

}
