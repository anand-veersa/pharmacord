import { Injectable } from '@angular/core';
import {
  FormArray,
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
import { matchPasswordsValidator } from '../validators/custom-validators';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public isLoading = new BehaviorSubject<boolean>(false);
  states: any[] = [
    { label: 'AL', value: 'AL' },
    { label: 'AK', value: 'AK' },
    { label: 'AR', value: 'AR' },
    { label: 'AS', value: 'AS' },
    { label: 'AZ', value: 'AZ' },
    { label: 'CA', value: 'CA' },
    { label: 'CO', value: 'CO' },
    { label: 'CT', value: 'CT' },
    { label: 'DE', value: 'DE' },
    { label: 'FL', value: 'FL' },
    { label: 'GA', value: 'GA' },
    { label: 'HI', value: 'HI' },
    { label: 'IA', value: 'IA' },
    { label: 'ID', value: 'ID' },
    { label: 'IL', value: 'IL' },
    { label: 'IN', value: 'IN' },
    { label: 'KS', value: 'KS' },
    { label: 'KY', value: 'KY' },
    { label: 'LA', value: 'LA' },
    { label: 'MA', value: 'MA' },
    { label: 'MD', value: 'MD' },
    { label: 'ME', value: 'ME' },
    { label: 'MI', value: 'MI' },
    { label: 'MN', value: 'MN' },
    { label: 'MO', value: 'MO' },
    { label: 'MS', value: 'MS' },
    { label: 'MT', value: 'MT' },
    { label: 'NC', value: 'NC' },
    { label: 'ND', value: 'ND' },
    { label: 'NE', value: 'NE' },
    { label: 'NH', value: 'NH' },
    { label: 'NJ', value: 'NJ' },
    { label: 'NM', value: 'NM' },
    { label: 'NV', value: 'NV' },
    { label: 'NY', value: 'NY' },
    { label: 'OH', value: 'OH' },
    { label: 'OK', value: 'OK' },
    { label: 'OR', value: 'OR' },
    { label: 'PA', value: 'PA' },
    { label: 'RI', value: 'RI' },
    { label: 'SC', value: 'SC' },
    { label: 'SD', value: 'SD' },
    { label: 'TN', value: 'TN' },
    { label: 'TX', value: 'TX' },
    { label: 'UT', value: 'UT' },
    { label: 'VA', value: 'VA' },
    { label: 'VI', value: 'VI' },
    { label: 'VT', value: 'VT' },
    { label: 'WA', value: 'WA' },
    { label: 'WI', value: 'WI' },
    { label: 'WV', value: 'WV' },
    { label: 'WY', value: 'WY' },
  ];

  constructor(
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  public buildForm(formData: JsonFormData): FormGroup {
    const formControl: { [key: string]: any } = {};
    formData.controls.forEach(field => {
      if (field.type === 'checkbox') {
        formControl[field.name] = new FormArray([]);
      } else {
        formControl[field.name] = new FormControl({
          value: field.value,
          disabled: field.disabled ?? false,
        });
        const validators = this.addValidator(field.validators, formControl);
        formControl[field.name].addValidators(validators);
      }
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

  public getFormattedDate(d: Date, apiFormatting: boolean = false): string {
    const date = new Date(d);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return apiFormatting ? `${month}${day}${year}` : `${month}/${day}/${year}`;
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

  public getPatients(cases: any[]): any[] {
    cases.sort(
      (a, b) => parseInt(b.CaseId.slice(3)) - parseInt(a.CaseId.slice(3))
    );
    const uniqueIds: any[] = [];
    return cases.filter((c: any) => {
      const isDuplicate = uniqueIds.includes(c.PatientId + c.DrugGroup.Value);
      if (!isDuplicate) {
        uniqueIds.push(c.PatientId + c.DrugGroup.Value);
        return true;
      }
      return;
    });
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
          return matchPasswordsValidator(formControl);
        default:
          return;
      }
    });
    return validators;
  }
}
