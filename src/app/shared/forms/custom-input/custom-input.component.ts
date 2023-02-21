import { Component, Input, OnInit } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [FormGroupDirective],
})
export class CustomInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() inputControl: JsonFormControls;
  @Input() fieldClassName: string = '';
  constructor(private formgroupDirective: FormGroupDirective) {}
  ngOnInit() {
    console.log(this.form);
  }
}
