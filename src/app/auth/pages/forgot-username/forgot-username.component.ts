import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedFormService } from 'src/app/shared/services/shared-form.service';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss'],
})
export class ForgotUsernameComponent implements OnInit {
  public forgotUsernameForm!: FormGroup;
  public formData!: JsonFormData;
  public inputFieldClass: string = 'secondary';
  public formControlNameArray: Array<string> = [
    'firstname',
    'lastname',
    'email',
  ];
  constructor(
    private http: HttpClient,
    private formService: SharedFormService
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/forgot-username-form.json')
      .subscribe((formData: any) => {
        this.formData = formData;
        this.forgotUsernameForm = this.formService.buildForm(this.formData);
      });
  }

  onSubmit() {
    console.log('submit');
  }
}
