import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
@Component({
  selector: 'app-enrollment-form-header',
  templateUrl: './enrollment-form-header.component.html',
  styleUrls: ['./enrollment-form-header.component.scss'],
})
export class EnrollmentFormHeaderComponent {
  @Input() title: string = '';
  @Input() displayedScreen: string = '';
  @Input() selectPrescriberForm: FormGroup;
  @Input() selectPrescriberField: JsonFormData;
  @Output() prescriberChanged = new EventEmitter();
}
