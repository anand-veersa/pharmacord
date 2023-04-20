import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-upload-documents',
  templateUrl: './custom-upload-documents.component.html',
  styleUrls: ['./custom-upload-documents.component.scss'],
})
export class CustomUploadDocumentsComponent {
  @Output() attachedDocuments: EventEmitter<any[]> = new EventEmitter();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { patientName: string; caseId: string; progressData: any[] }
  ) {}

  public browseFile(): void {
    const browseFileRef = document.getElementById('browseFileRef');
    browseFileRef?.click();
  }

  public setAttachDoc(event: any): void {
    const attachedDocuments = Object.values(event.target.files);
    this.attachedDocuments.emit(attachedDocuments);
  }
}
