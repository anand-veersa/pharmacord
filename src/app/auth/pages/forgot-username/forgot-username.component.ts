import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss'],
})
export class ForgotUsernameComponent implements OnInit {
  public forgotUsernameForm: FormGroup;
  public formData?: JsonFormData;
  public inputFieldClass: string = 'secondary';
  public formControlNameArray: Array<string> = [
    'firstname',
    'lastname',
    'email',
  ];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('/assets/json/forgot-username-form.json')
      .subscribe((formData: any) => {
        this.formData = formData;
      });

    this.forgotUsernameForm = new FormGroup({
      firstname: new FormControl(null),
      lastname: new FormControl(null),
      email: new FormControl(null),
    });
  }

  onSubmit() {
    console.log('forgot-username-form submit btn', this.forgotUsernameForm);
  }
}
