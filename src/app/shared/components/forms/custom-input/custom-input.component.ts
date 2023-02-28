import { Component, Input, OnInit } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() fieldClassName: string = '';

  ngOnInit() {
    console.log(this.form);
  }
}
