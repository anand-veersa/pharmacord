import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../auth.service';

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
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/forgot-password-confirm-username-email-form.json')
      .subscribe((formData: any) => {
        this.formDataVerifyForm = formData;
        this.forgotPasswordVerifyForm = this.sharedService.buildForm(
          this.formDataVerifyForm
        );
      });

    this.http
      .get('/assets/json/forgot-password-security-questions-form.json')
      .subscribe((formData: any) => {
        this.formDataQuestionForm = formData;
        this.forgotPasswordQuestionForm = this.sharedService.buildForm(
          this.formDataQuestionForm
        );
      });

    this.http
      .get('/assets/json/forgot-password-confirm-password-form.json')
      .subscribe((formData: any) => {
        this.formDataConfirmForm = formData;
        this.forgotPasswordConfirmForm = this.sharedService.buildForm(
          this.formDataConfirmForm
        );
      });
  }

  verifyIdentity() {
    this.sharedService.isLoading.next(true);
    const payloadForVerifyIdentity = {
      Username: this.forgotPasswordVerifyForm.get('userName')?.value,
      Email: this.forgotPasswordVerifyForm.get('email')?.value,
    };

    this.authService.getSecurityQuestions(payloadForVerifyIdentity).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          for (let i = 0; i < res.Payload.length; i++) {
            this.formDataQuestionForm.controls[i].label =
              res.Payload[i].SecurityQuestion.QuestionText;
          }
          // after successfull call
          this.containerHeader = 'Answer Security Question';
          this.containerSubHeader = 'Answer Security Questions';
          this.containerSubHeaderInformation =
            'Please answer the following security questions to identify yourself.';
          this.showVerifyForm = false;
          this.showQuestionForm = true;
        } else {
          console.log(res.Status);
        }
        this.sharedService.isLoading.next(false);
      },
      error: (err: any) => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }
  verifyQuestionAnswer() {
    this.containerHeader = 'Confirm New Password';
    this.containerSubHeader = 'Confirm Your New Password';
    this.containerSubHeaderInformation = 'Please choose a new password.';
    this.showQuestionForm = false;
    this.showConfirmForm = true;
  }
  submitNewPassword() {
    this.passwordResetSuccessful = true;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
