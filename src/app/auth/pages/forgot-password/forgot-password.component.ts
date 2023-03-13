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
  public containerHeader: string = 'Forgot Password';
  public containerSubHeader: string = 'Confirm Username & Email Address';
  public containerSubHeaderInformation: string =
    'Please verify the username and email address for your account.';
  public showVerifyForm: boolean = true;
  public showQuestionForm: boolean = false;
  public showConfirmForm: boolean = false;
  public passwordResetSuccessful: boolean = false;
  public securityQuestionsID: number[] = [];
  public securityAnswerData: any[] = [];
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

  verifyIdentity(): void {
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
            this.securityQuestionsID?.push(res.Payload[i].SecurityQuestion.Id);
          }
          // after successfull call
          this.containerHeader = 'Answer Security Question';
          this.containerSubHeader = 'Answer Security Questions';
          this.containerSubHeaderInformation =
            'Please answer the following security questions to identify yourself.';
          this.showVerifyForm = false;
          this.showQuestionForm = true;
        }
        this.sharedService.isLoading.next(false);
      },
      error: (err: any) => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  verifyQuestionAnswer(): void {
    this.containerHeader = 'Confirm New Password';
    this.containerSubHeader = 'Confirm Your New Password';
    this.containerSubHeaderInformation = 'Please choose a new password.';
    this.showQuestionForm = false;
    this.showConfirmForm = true;
  }

  submitNewPassword(): void {
    this.sharedService.isLoading.next(true);
    let index = 1;
    this.securityAnswerData = [];
    for (const item of this.securityQuestionsID) {
      this.securityAnswerData.push({
        SecurityQuestion: { Id: item },
        Choice: null,
        Answer: this.forgotPasswordQuestionForm.get(`securityQuestion${index}`)
          ?.value,
      });
      index++;
    }

    const payloadResetPassword = {
      UserName: this.forgotPasswordVerifyForm.get('userName')?.value,
      Password: this.forgotPasswordConfirmForm.get('newPassword')?.value,
      PasswordConfirmation:
        this.forgotPasswordConfirmForm.get('confirmNewPassword')?.value,
      SecurityAnswers: this.securityAnswerData,
    };

    this.authService.resetPassword(payloadResetPassword).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          this.passwordResetSuccessful = true;
        } else {
          this.sharedService.notify('error', res.Errors[0].Message);
        }
        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  showPrevious(): void {
    if (this.containerHeader === 'Confirm New Password') {
      this.containerHeader = 'Answer Security Question';
      this.containerSubHeader = 'Answer Security Questions';
      this.containerSubHeaderInformation =
        'Please answer the following security questions to identify yourself.';
      this.showVerifyForm = false;
      this.showQuestionForm = true;
      this.showConfirmForm = false;
    } else {
      this.containerHeader = 'Forgot Password';
      this.containerSubHeader = 'Confirm Username & Email Address';
      this.containerSubHeaderInformation =
        'Please verify the username and email address for your account.';
      this.showVerifyForm = true;
      this.showQuestionForm = false;
      this.showConfirmForm = false;
    }
  }
}
