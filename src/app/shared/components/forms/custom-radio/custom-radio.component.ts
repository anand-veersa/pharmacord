import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-custom-radio',
  templateUrl: './custom-radio.component.html',
  styleUrls: ['./custom-radio.component.scss'],
})
export class CustomRadioComponent {
  @Input() form: FormGroup;
  @Input() formType: string = '';
  @Input() field: JsonFormControls;
}
