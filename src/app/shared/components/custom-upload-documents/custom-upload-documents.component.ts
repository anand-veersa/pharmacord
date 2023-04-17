import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-custom-upload-documents',
  templateUrl: './custom-upload-documents.component.html',
  styleUrls: ['./custom-upload-documents.component.scss'],
})
export class CustomUploadDocumentsComponent {
  @Output() attachedDocuments: EventEmitter<any[]> = new EventEmitter();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  public browseFile(): void {
    const browseFileRef = document.getElementById('browseFileRef');
    browseFileRef?.click();
  }

  public setAttachDoc(event: any): void {
    const attachedDocuments = Object.values(event.target.files);
    this.attachedDocuments.emit(attachedDocuments);
  }
}
