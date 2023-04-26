import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import isEqual from 'lodash.isequal';
@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
})
export class CustomCheckboxComponent implements OnInit {
  @Input() checked: any[] = [];
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() formType: string = '';
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  public ngOnInit(): void {
    if (this.checked.length > 0) {
      const formArray = <FormArray>this.form.controls[this.field.name];
      this.checked.forEach(value => formArray.push(new FormControl(value)));
    }
  }

  public isSame(haystack: any[], needle: any): boolean {
    let isSame = false;
    haystack.forEach(el => {
      if (isEqual(el, needle)) isSame = true;
    });
    return isSame;
  }

  public onChecked(isChecked: boolean, value: any, index: number): void {
    const formArray = <FormArray>this.form.controls[this.field.name];
    if (isChecked) {
      formArray.push(new FormControl(value));
    } else {
      formArray.removeAt(index);
    }
    this.action.emit({ isChecked, field: this.field });
  }
}
