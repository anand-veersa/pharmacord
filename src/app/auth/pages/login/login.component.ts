import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../auth.service';

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
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.get('/assets/json/login-form.json').subscribe((formData: any) => {
      this.formData = formData;
      this.loginForm = this.sharedService.buildForm(this.formData);
    });
  }
  onSubmit(): void {
    this.sharedService.isLoading.next(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.sharedService.isLoading.next(false);
        this.router.navigate(['/enrollment/dashboard']);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  navigateToRegistration() {
    this.router.navigate(['/registration']);
  }
}
