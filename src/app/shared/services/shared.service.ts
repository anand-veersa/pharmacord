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
import { Patient } from 'src/app/models/cases.model';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { MatchPasswordsValidator } from '../validators/match-passwords.validator';
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
      formControl[field.name] = new FormControl(field.value);
      const validators = this.addValidator(field.validators, formControl);
      formControl[field.name].addValidators(validators);
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

  public getProviderName(prescriberId: string): string {
    if (prescriberId) {
      const provider = this.authService.user?.providers.filter(
        prov => prov.ProviderId == prescriberId
      );
      if (provider) {
        return provider[0].FirstName + ' ' + provider[0].LastName;
      }
    }
    return '--';
  }

  public capitalize(str: string): string {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }

  private addValidator(
    rules: any,
    formControl: { [key: string]: any }
  ): ValidationErrors | null {
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
        case 'match':
          return MatchPasswordsValidator(formControl);
        default:
          return;
      }
    });
    return validators;
  }

  public filterSearch(
    search: string,
    data: Patient[],
    fieldsToSearch: string[] = []
  ): any[] {
    return data.filter((record: any) => {
      const tempRecord: any[] = [];
      Object.keys(record).map((keyName: string, index: number) => {
        if (fieldsToSearch?.length > 0 && !fieldsToSearch.includes(keyName))
          return;
        else {
          if (typeof record[keyName] == 'object') {
            tempRecord.push(record[keyName]?.text);
          } else {
            tempRecord.push(record[keyName]);
          }
        }
      });
      if (
        JSON.stringify(tempRecord)
          ?.toLowerCase()
          .indexOf(search.toLowerCase()) > -1
      )
        return record;
    });
  }
}
