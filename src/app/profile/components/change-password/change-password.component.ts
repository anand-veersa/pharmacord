import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements AfterViewChecked {
  constructor(
    public profileService: ProfileService,
    private sharedService: SharedService,
    private localStorage: LocalStorageService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.profileService.createChangePasswordForm();
    this.cdref.detectChanges();
  }

  public saveChangePassword(): void {
    this.sharedService.isLoading.next(true);
    const changePasswordPayload = {
      UserName: JSON.parse(this.localStorage.getItem('userData'))?.UserName,
      CurrentPassword:
        this.profileService.changePasswordForm.get('currentPassword')?.value,
      Password:
        this.profileService.changePasswordForm.get('newPassword')?.value,
      PasswordConfirmation:
        this.profileService.changePasswordForm.get('confirmNewPassword')?.value,
    };
    this.profileService.changePassword(changePasswordPayload).subscribe({
      next: (res: any) => {
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
}
