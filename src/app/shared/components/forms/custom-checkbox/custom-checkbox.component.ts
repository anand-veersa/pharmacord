import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import isEqual from 'lodash.isequal';
import { check } from 'prettier';

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

  // public ngOnInit(): void {
  //   console.log(this.field);
  //   if (this.checked.length > 0 && !this.field.preventDefaultSelection) {
  //     const formArray = <FormArray>this.form.controls[this.field.name];
  //     this.checked.forEach(value => formArray.push(new FormControl(value)));
  //   }
  // }

  public isChecked(): boolean {
    return this.form.controls[this.field.name].value ? true : false;
    // let isSame = false;
    // haystack.forEach(el => {
    //   if (isEqual(el, needle)) isSame = true;
    // });
    // return isSame;
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
      // const formArray = <FormArray>this.form.controls[this.field.name];
      // if (isChecked) {
      //   formArray.push(new FormControl(value));
      // } else {
      //   formArray.removeAt(index);
      // }
      const checkValue = isChecked ? value : '';
      this.form.controls[this.field.name].setValue(checkValue);
      this.action.emit({ value: isChecked, field: this.field });
    }
  }
}
