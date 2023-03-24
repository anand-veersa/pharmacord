import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public formData: JsonFormData;
  public changePasswordForm: FormGroup;
  private changePasswordCall: Subscription;
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private localStorage: LocalStorageService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.changePasswordCall = this.http
      .get('/assets/json/change-password.json')
      .subscribe((formData: any) => {
        this.formData = formData;
        this.changePasswordForm = this.sharedService.buildForm(this.formData);
        console.log('change ', this.changePasswordForm);
      });
  }

  public saveChangePassword(): void {
    this.sharedService.isLoading.next(true);
    const changePasswordPayload = {
      UserName: JSON.parse(this.localStorage.getItem('userData')).UserName,
      CurrentPassword: this.changePasswordForm.get('currentPassword')?.value,
      Password: this.changePasswordForm.get('newPassword')?.value,
      PasswordConfirmation:
        this.changePasswordForm.get('confirmNewPassword')?.value,
    };
    console.log('changePasswordPayload', changePasswordPayload);
    this.profileService.changePassword(changePasswordPayload).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.Status === 'SUCCESS') {
          this.sharedService.notify('success', res.Payload.Message);
        }
        this.sharedService.isLoading.next(false);
      },
      error: (err: any) => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
  }
  ngOnDestroy(): void {
    this.changePasswordCall.unsubscribe();
  }
}
