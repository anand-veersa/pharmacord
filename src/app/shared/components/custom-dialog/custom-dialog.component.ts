import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss'],
})
export class CustomDialogComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  sanitizedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.data.htmlString
    );
  }
}
