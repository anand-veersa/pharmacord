import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-error',
  templateUrl: './custom-error.component.html',
  styleUrls: ['./custom-error.component.scss'],
})
export class CustomErrorComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() field: any;
  @Input() errors: any;
  public errorMessage = '';

  ngOnChanges() {
    this.getErrorMessage();
  }

  getErrorMessage() {
    //TODO: OPTIMIZE THIS BLOCK
    this.errorMessage = '';
    if (!this.errors) return;
    const errorKeys = Object.keys(this.errors);
    if (errorKeys.includes('required')) {
      this.errorMessage = `${this.field.name} is required`;
    } else if (errorKeys.includes('minlength')) {
      this.errorMessage = `${this.field.name} must have ${this.field.validators.min} characters`;
    } else if (errorKeys.includes('maxlength')) {
      this.errorMessage = `${this.field.name} should not exceed  ${this.field.validators.max} characters`;
    } else {
      this.errorMessage = `${this.field.name} is invalid`;
    }
    return this.errorMessage;
  }
}
