import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './add-event-dialog.component.html',
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class AddEventDialogComponent {
  event = {
    title: '',
    startTime: '',
    endTime: '',
    moment: '',
    date: '',
  };
  dateFormatted: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dateFormatted = new Date(this.data.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if(this.event.moment ==="midi"){
      this.event.startTime = "12:00"
      this.event.endTime = "13:00"
    }else if(this.event.moment ==="soir"){
      this.event.startTime = "19:00"
      this.event.endTime = "20:00"
    }else if(this.event.moment ==="both"){
      this.event.startTime = "12:00"
      this.event.endTime = "20:00"
    }
    this.event.date = this.data.date;
    this.dialogRef.close({
      ...this.event,
      daysOfWeek: [this.data.dayOfWeek],
      backgroundColor: this.event.startTime.startsWith('12') ? 'green' : 'blue'
    });
  }
}
