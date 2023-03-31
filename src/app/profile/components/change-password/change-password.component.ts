import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private sharedService: SharedService,
    private localStorage: LocalStorageService,
    public profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.createChangePassword();
  }

  public saveChangePassword(): void {
    this.sharedService.isLoading.next(true);
    const changePasswordPayload = {
      UserName: JSON.parse(this.localStorage.getItem('userData')).UserName,
      CurrentPassword:
        this.profileService.changePasswordForm.get('currentPassword')?.value,
      Password:
        this.profileService.changePasswordForm.get('newPassword')?.value,
      PasswordConfirmation:
        this.profileService.changePasswordForm.get('confirmNewPassword')?.value,
    };
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
}
