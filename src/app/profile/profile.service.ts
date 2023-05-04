import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { JsonFormData } from '../models/json-form-data.model';
import { SharedService } from '../shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public changePasswordForm: FormGroup;
  public profileInformationForm: FormGroup;
  public changeSecurityQuesForm: FormGroup;
  public changePasswordJson: JsonFormData;
  public profileInfoJson: JsonFormData;
  public changeSecurityQuesJSON: JsonFormData;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  public changePassword(data: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}portal/account/person/updatePassword`, data)
      .pipe(
        catchError(this.handleError),
        tap(res => this.handleToaster(res))
      );
  }

  public setFirstTimeSecurityQuestion(data: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}securityQuestion/save`, data)
      .pipe(
        catchError(this.handleError),
        tap(res => this.handleToaster(res))
      );
  }

  public updateChangeSecurityQuestion(data: any): Observable<any> {
    return this.http
      .post(
        `${environment.baseUrl}portal/account/answerSecurityQuestionUpdate`,
        data
      )
      .pipe(
        catchError(this.handleError),
        tap(res => this.handleToaster(res))
      );
  }

  public profileInformation(data: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}portal/account/person/update`, data)
      .pipe(catchError(this.handleError));
  }

  public createChangePasswordForm(): void {
    if (!this.changePasswordForm) {
      this.http
        .get('/assets/json/change-password.json')
        .subscribe((formData: any) => {
          this.changePasswordJson = formData;
          this.changePasswordForm = this.sharedService.buildForm(
            this.changePasswordJson
          );
        });
    }
  }

  public createChangeSecurityQuesForm(
    options: any,
    selectedOptions: number[]
  ): void {
    if (!this.changeSecurityQuesForm) {
      this.http
        .get('/assets/json/change-security-ques.json')
        .subscribe((formData: any) => {
          this.changeSecurityQuesJSON = formData;
          if (selectedOptions.length === 0) {
            this.changeSecurityQuesJSON.controls.forEach(el => {
              if (['question1', 'question2', 'question3'].includes(el.name)) {
                el.options = options;
              }
            });
          } else {
            this.changeSecurityQuesJSON.controls.forEach(el => {
              if (el.name === 'question1') {
                el.options = options[0];
                el.value = selectedOptions[0];
              } else if (el.name === 'question2') {
                el.options = options[1];
                el.value = selectedOptions[1];
              } else if (el.name === 'question3') {
                el.options = options[2];
                el.value = selectedOptions[2];
              }
            });
          }

          this.changeSecurityQuesForm = this.sharedService.buildForm(
            this.changeSecurityQuesJSON
          );
        });
    }
  }

  public createProfileInfo(): void {
    if (!this.profileInformationForm) {
      this.http
        .get('/assets/json/profile-information.json')
        .subscribe((formData: any) => {
          this.profileInfoJson = formData;
          this.profileInformationForm = this.sharedService.buildForm(
            this.profileInfoJson
          );
          this.getProfileInfo();
        });
    }
  }

  public getSecurityQuestions(): Observable<any> {
    return this.http
      .get(`${environment.baseUrl}portal/securityQuestion`)
      .pipe(catchError(this.handleError));
  }

  public getSecurityQuestionsbyId(PortalAccountPkId: number): Observable<any> {
    return this.http
      .get(
        `${environment.baseUrl}portal/account/securityQuestion/${PortalAccountPkId}`
      )
      .pipe(catchError(this.handleError));
  }

  public resetForms(): void {
    this.changePasswordForm?.reset();
    this.changeSecurityQuesForm?.reset();
    this.profileInformationForm?.reset();
  }

  private handleToaster(response: any): void {
    const msg = response.Errors[0]?.Message;
    if (!msg) return;
    else if (msg.indexOf('New password matches a previous password') > -1) {
      this.sharedService.notify(
        'error',
        'You used this password recently. Please choose a different one'
      );
    } else if (
      msg.indexOf('New password matches current account password') > -1
    ) {
      this.sharedService.notify(
        'error',
        'New password matches current account password'
      );
    } else if (
      msg.indexOf('The username/password does not match error message') > -1
    ) {
      this.sharedService.notify('error', 'Entered wrong current password');
    } else if (
      msg.indexOf(
        'The supplied details not matching, Security Questions are not updated'
      ) > -1
    ) {
      this.sharedService.notify(
        'error',
        'The supplied Password is incorrect,Security Questions are not updated'
      );
    }
  }

  private handleError(errorRes: number): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes) {
      return throwError(() => errorMessage);
    }
    switch (errorRes) {
      case 400:
        errorMessage = 'The supplied credentials are incorrect';
        break;
      case 500:
        errorMessage = 'Something went wrong. Please try again';
        break;
    }
    return throwError(() => errorMessage);
  }

  private getProfileInfo(): void {
    const { firstName, lastName, email, phone, fax } = this.authService.user;

    this.profileInformationForm.controls['firstName'].setValue(firstName);
    this.profileInformationForm.controls['lastName'].setValue(lastName);
    this.profileInformationForm.controls['phone'].setValue(phone);
    this.profileInformationForm.controls['fax'].setValue(fax);
    this.profileInformationForm.controls['email'].setValue(email);
  }
}
