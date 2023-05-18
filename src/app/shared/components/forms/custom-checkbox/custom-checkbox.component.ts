import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
})
export class CustomCheckboxComponent {
  //TODO: remove lodash and unused input
  @Input() checked: any[] = [];
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() formType: string = '';
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('checkbox') checkboxRef: any;

  public isChecked(): boolean {
    return this.form.controls[this.field.name].value ? true : false;
  }

  public onChecked(isChecked: boolean, value: any, index: number): void {
    if (this.field.preventDefaultSelection) {
      this.checkboxRef.checked = false;
      this.action.emit({
        checkboxRef: this.checkboxRef,
        isChecked,
        field: this.field,
      });
    } else {
      const checkValue = isChecked ? value : '';
      this.form.controls[this.field.name].setValue(checkValue);
      this.action.emit({ value: isChecked, field: this.field });
    }
  }
}
