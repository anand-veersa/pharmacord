import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss'],
})
export class ForgotUsernameComponent implements OnInit {
  public forgotUsernameForm!: FormGroup;
  public formData!: JsonFormData;
  resetSuccess: boolean = false;
  submitBtnClicked: boolean = false;
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/forgot-username-form.json')
      .subscribe((formData: any) => {
        this.formData = formData;
        this.forgotUsernameForm = this.sharedService.buildForm(this.formData);
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  submitResetUsername(): void {
    this.submitBtnClicked = true;
    this.sharedService.isLoading.next(true);
    const finalPayload = {
      FirstName: this.forgotUsernameForm.get('firstName')?.value,
      LastName: this.forgotUsernameForm.get('lastName')?.value,
      Email: this.forgotUsernameForm.get('email')?.value,
    };
    this.authService.resetUsername(finalPayload).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          this.resetSuccess = true;
        } else {
          this.resetSuccess = false;
        }
        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }
}
