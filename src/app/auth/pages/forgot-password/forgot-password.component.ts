import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordVerifyForm!: FormGroup;
  public forgotPasswordQuestionForm!: FormGroup;
  public forgotPasswordConfirmForm!: FormGroup;
  public formDataVerifyForm!: JsonFormData;
  public formDataQuestionForm!: JsonFormData;
  public formDataConfirmForm!: JsonFormData;
  containerHeader: string = 'Forgot Password';
  containerSubHeader: string = 'Confirm Username & Email Address';
  containerSubHeaderInformation: string =
    'Please verify the username and email address for your account.';
  showVerifyForm: boolean = true;
  showQuestionForm: boolean = false;
  showConfirmForm: boolean = false;
  passwordResetSuccessful: boolean = false;
  constructor(
    private http: HttpClient,
    private formService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/forgot-password-confirm-username-email-form.json')
      .subscribe((formData: any) => {
        this.formDataVerifyForm = formData;
        this.forgotPasswordVerifyForm = this.formService.buildForm(
          this.formDataVerifyForm
        );
      });

    this.http
      .get('/assets/json/forgot-password-security-questions-form.json')
      .subscribe((formData: any) => {
        this.formDataQuestionForm = formData;
        this.forgotPasswordQuestionForm = this.formService.buildForm(
          this.formDataQuestionForm
        );
      });

    this.http
      .get('/assets/json/forgot-password-confirm-password-form.json')
      .subscribe((formData: any) => {
        this.formDataConfirmForm = formData;
        this.forgotPasswordConfirmForm = this.formService.buildForm(
          this.formDataConfirmForm
        );
      });
  }

  verifyIdentity() {
    console.log(this.forgotPasswordVerifyForm);
    this.containerHeader = 'Answer Security Question';
    this.containerSubHeader = 'Answer Security Questions';
    this.containerSubHeaderInformation =
      'Please answer the following security questions to identify yourself.';
    this.showVerifyForm = false;
    this.showQuestionForm = true;
  }
  verifyQuestionAnswer() {
    console.log(this.forgotPasswordQuestionForm);
    this.containerHeader = 'Confirm New Password';
    this.containerSubHeader = 'Confirm Your New Password';
    this.containerSubHeaderInformation = 'Please choose a new password.';
    this.showQuestionForm = false;
    this.showConfirmForm = true;
  }
  submitNewPassword() {
    console.log(this.forgotPasswordConfirmForm);
    this.passwordResetSuccessful = true;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
