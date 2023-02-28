import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
})
export class CustomCheckboxComponent {
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
}
