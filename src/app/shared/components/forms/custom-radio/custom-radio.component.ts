import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
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
  @Output() action = new EventEmitter<string>();

  onChange(e: MatRadioChange) {
    this.action.emit(e.value);
  }
}
