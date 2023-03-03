import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { JsonFormData } from 'src/app/models/json-form-data.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public isLoading = new BehaviorSubject<boolean>(false);

  public buildForm(formData: JsonFormData): FormGroup {
    const formControl: { [key: string]: any } = {};
    formData.controls.forEach(field => {
      const validators = this.addValidator(field.validators);
      formControl[field.name] = new FormControl(field.value, validators);
    });
    return new FormGroup(formControl);
  }

  private addValidator(rules: any) {
    let validators: any[] = [];
    if (!rules) {
      return validators;
    }
    validators = Object.entries(rules).map((rule: [key: string, val: any]) => {
      switch (rule[0]) {
        case 'required':
          if (!rule[1]) {
            return;
          }
          return Validators.required;
        case 'max':
          return Validators.maxLength(rule[1]);
        case 'min':
          return Validators.minLength(rule[1]);
        case 'pattern':
          return Validators.pattern(rule[1]);
        default:
          return;
      }
    });
    return validators;
  }
}
