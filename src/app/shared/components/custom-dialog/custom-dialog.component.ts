import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss'],
})
export class CustomDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      content: string;
      imgIcon: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}

  ngOnInit() {
    if (!this.data.confirmText) this.data.confirmText = 'Yes';
    if (!this.data.cancelText) this.data.cancelText = 'No';
  }
}
