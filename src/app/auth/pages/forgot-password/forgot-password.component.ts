import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public confirmUsernameEmailForm: FormGroup;
  public formData: JsonFormData;
  public inputFieldClass: string = 'secondary';
  public formControlNameArray: Array<string> = ['username', 'email'];
  public forgotPAsswordForm1: boolean = true;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('/assets/json/forgot-password-confirm-username-password-form.json')
      .subscribe((formData: any) => {
        this.formData = formData;
      });

    this.confirmUsernameEmailForm = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null),
    });
  }

  onSubmit() {
    console.log('submit');
  }
}
