import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private http: HttpClient,
    private sharedService: SharedService,
    public profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.createProfileInfo();
  }

  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
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
        Phone: this.profileService.profileInformationForm.get('phone')?.value,
        Fax: this.profileService.profileInformationForm.get('fax')?.value,
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
