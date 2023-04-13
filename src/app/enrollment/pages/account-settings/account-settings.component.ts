import { Component, Input, OnInit } from '@angular/core';
import { EnrollmentService } from '../../enrollment.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  @Input() cases: any[] = [];
  public facilityTabTitle = 'Manage Practice Office(s)';
  public facilityTabSubTitle =
    'Please add or update the Practice/Facility information associated with this account.';
  public facilities: [] = [];
  constructor(
    private enrolService: EnrollmentService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  collectMasterFacilities(eventData: { facilities: any }): void {
    this.facilities = eventData.facilities;
    console.log(this.facilities, 'in account setting page');

    // this.facilities.filter(facility => {
    //   return this.currentFacilities.includes(facility);
    // });
    // delete this.authService.user.userDetails.AccountStatus;
    const ContactsPayload: any = {
      ...this.authService.user.userDetails,
      Id: null,
      OfficeContactType: 'Office Contact',
      Rank: 1,
      Title: null,
      Extension: null,
    };

    delete ContactsPayload['AccountStatus'];

    console.log(ContactsPayload, 'user contact details');
    for (const facility of eventData.facilities) {
      facility.Contacts?.push(ContactsPayload);
      const addFacilityPayload = {
        Username: this.authService.user.username,
        MasterAccountId: this.authService.user.portalAccountPkId,
        IsNewUser: false,
        MasterFacility: facility,
      };
      this.enrolService.updateFacility(addFacilityPayload).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            console.log(res.payload, 'after upload');
          }
        },
        error: err => {
          this.sharedService.notify('error', err);
        },
      });
    }
  }

  facilitiesToDelete(eventData: { facilities: any }): void {
    console.log(eventData.facilities, 'to Delte');

    for (const facility of eventData.facilities) {
      const deletePayload = [facility.Id];
      this.enrolService.deleteFacility(deletePayload).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            console.log(res.Payload, 'after delete payload');
          }
        },
        error: err => {
          this.sharedService.notify('error', err);
        },
      });
    }
  }
}
