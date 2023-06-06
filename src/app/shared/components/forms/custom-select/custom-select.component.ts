import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent {
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() formType: string = '';
  @Output() action = new EventEmitter();
  public errors: ValidationErrors | null | undefined;

  ngOnInit() {
    this.errors = this.form.get(this.field.name)?.errors;
  }

  public selectionChanged(event: MatSelectChange): void {
    this.action.emit({ value: event.value, field: this.field });
  }
}
