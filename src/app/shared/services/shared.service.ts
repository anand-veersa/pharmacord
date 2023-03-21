import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { JsonFormData } from 'src/app/models/json-form-data.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  public isLoading = new BehaviorSubject<boolean>(false);

  public buildForm(formData: JsonFormData): FormGroup {
    const formControl: { [key: string]: any } = {};
    formData.controls.forEach(field => {
      const validators = this.addValidator(field.validators);
      formControl[field.name] = new FormControl(field.value, validators);
    });
    return new FormGroup(formControl);
  }

  public notify(
    type: string,
    msg: string,
    title: string = '',
    config: any = {}
  ): void {
    type === 'success'
      ? this.toastr.success(msg, title)
      : this.toastr.error(msg, title);
  }

  public downloadFile(filePath: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
    link.remove();
  }

  public getFormattedDate(d: Date): string {
    const date = new Date(d);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/' + year;
  }

  public getPrescriberName(prescriberId: string): string {
    if (prescriberId) {
      const prescriber = this.authService.user?.prescribers.filter(
        pre => pre.ProviderId == prescriberId
      );
      if (prescriber) {
        return prescriber[0].FirstName + ' ' + prescriber[0].LastName;
      }
    }
    return '--';
  }

  public capitalize(str: string): string {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }

  private addValidator(rules: any): ValidationErrors {
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
