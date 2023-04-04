import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-custom-datepicker',
  templateUrl: './custom-datepicker.component.html',
  styleUrls: ['./custom-datepicker.component.scss'],
})
export class CustomDatepickerComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() formType: string = '';
  @Input() inputPrefix: string;
  public fieldId: string;
  public errors: ValidationErrors | null | undefined;

  ngOnInit(): void {
    this.fieldId = this.field.name;
  }
}
