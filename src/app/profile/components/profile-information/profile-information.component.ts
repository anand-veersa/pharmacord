import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
})
export class ProfileInformationComponent implements OnInit {
  constructor(
    public profileService: ProfileService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileService.createProfileInfo();
  }

  public saveProfileInformation(): void {
    this.sharedService.isLoading.next(true);
    const profileInformationPayload = {
      MasterAccountId: this.authService?.user?.portalAccountPkId,
      UserContactDetails: {
        FirstName:
          this.profileService.profileInformationForm.get('firstName')?.value,
        LastName:
          this.profileService.profileInformationForm.get('lastName')?.value,
        Email: this.profileService.profileInformationForm.get('email')?.value,
        Phone: this.profileService.profileInformationForm
          .get('phone')
          ?.value?.replace(/\D/g, ''),
        Fax: this.profileService.profileInformationForm
          .get('fax')
          ?.value?.replace(/\D/g, ''),
      },
    };
    this.profileService
      .profileInformation(profileInformationPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            this.sharedService.notify(
              'success',
              'Profile details are updated successfully!'
            );
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
