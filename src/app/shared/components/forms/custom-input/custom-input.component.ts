import { Component, Input, OnInit } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() fieldName: string;
  @Input() formType: string = '';
  public errors: ValidationErrors | null | undefined;

  ngOnInit() {
    this.errors = this.form.get(this.field.name)?.errors;
  }
}
