import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogRef, MatDialog,
  MatDialogTitle,
  MatDialogContent, MatDialogActions,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './event-dialog.component.html'
})
export class EventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  edit(): void {
    this.dialogRef.close({ action: 'edit' });
  }

  delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }

  close(): void {
    this.dialogRef.close();
  }
}
