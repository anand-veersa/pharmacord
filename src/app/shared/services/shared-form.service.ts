import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';

@Injectable({
  providedIn: 'root',
})
export class SharedFormService {
  public buildForm(formData: JsonFormData): FormGroup {
    const formObject = [];
    const formControl: { [key: string]: any } = {};
    formData.controls.forEach(field => {
      formControl[field.name] = new FormControl(field.value);
    });
    return new FormGroup(formControl);
  }
}