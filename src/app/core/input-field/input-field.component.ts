import { Component } from '@angular/core';

@Component({
  
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  private label: string;
  private type: string;


  private placeholder: string;
  private validityErrorMsg: string;
  private reqErrorMsg: string;
  private formControlName: string;


}
