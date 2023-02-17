import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JsonFormData } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formData: JsonFormData;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/assets/json/login-form.json').subscribe((formData: any) => {
      this.formData = formData;
      console.log(this.formData);
    });
  }
}
