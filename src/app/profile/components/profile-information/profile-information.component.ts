import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
})
export class ProfileInformationComponent implements OnInit {
  public formData: JsonFormData;
  public profileInformationForm: FormGroup;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/profile-information.json')
      .subscribe((formData: any) => {
        this.formData = formData;
        this.profileInformationForm = this.sharedService.buildForm(
          this.formData
        );
        this.getProfileInfo();
      });
  }

  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
  }

  public saveProfileInformation(): void {
    this.sharedService.isLoading.next(true);
    const profileInformationPayload = {
      MasterAccountId: this.authService?.user?.portalAccountPkId,
      UserContactDetails: {
        FirstName: this.profileInformationForm.get('firstName')?.value,
        LastName: this.profileInformationForm.get('lastName')?.value,
        Email: this.profileInformationForm.get('email')?.value,
        Phone: this.profileInformationForm.get('phone')?.value,
        Fax: this.profileInformationForm.get('fax')?.value,
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

  private getProfileInfo(): void {
    const { firstName, lastName, email, phone, fax } = this.authService.user;

    this.profileInformationForm.controls['firstName'].setValue(firstName);
    this.profileInformationForm.controls['lastName'].setValue(lastName);
    this.profileInformationForm.controls['phone'].setValue(phone);
    this.profileInformationForm.controls['fax'].setValue(fax);
    this.profileInformationForm.controls['email'].setValue(email);
  }
}
