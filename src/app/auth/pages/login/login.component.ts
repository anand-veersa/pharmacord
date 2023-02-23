import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedFormService } from 'src/app/shared/services/shared-form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formData!: JsonFormData;
  public inputFieldClass: string = 'form-field-tertiary';
  public loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formService: SharedFormService
  ) {}

  ngOnInit() {
    this.http.get('/assets/json/login-form.json').subscribe((formData: any) => {
      this.formData = formData;
      this.loginForm = this.formService.buildForm(this.formData);
    });
  }
}
