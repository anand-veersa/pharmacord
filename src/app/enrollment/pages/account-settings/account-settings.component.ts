import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EnrollmentService } from '../../enrollment.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit, AfterViewInit {
  @Input() cases: any[] = [];
  public facilityTabTitle = 'Manage Practice Office(s)';
  public facilityTabSubTitle =
    'Please add or update the Practice/Facility information associated with this account.';
  public facilities: [] = [];
  public providerTabTitle = 'Manage Healthcare Providers';
  public providerTabSubTitle =
    'Please add or update the healthcare providers and offices associated with this account.';
  public providersWithAllFacilities: any[] = [];
  public providersWithSelectedFacilities: any[] = [];
  public hcpAllFacilities: any[] = [];
  public facilitiesWithoutProvider: any[] = [];
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    private enrolService: EnrollmentService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('init of account setting');
    // this.getUpdatedProviderDetails();
  }

  ngAfterViewInit() {
    console.log('afterViewInit => ', this.tabGroup.selectedIndex);
  }

  // collect and update call for each facility coming
  collectMasterFacilities(eventData: { facilities: any }): void {
    this.facilities = eventData.facilities;
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
          this.getUpdatedProviderDetails(); // remove this and place to success call
          this.getAllFacilities(); // remove this and place to success call
        },
      });
    }
    this.getUpdatedProviderDetails();
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

  // here we will have the updated values of all facilities wrt providers
  getUpdatedProviderDetails(): void {
    this.sharedService.isLoading.next(true);
    this.enrolService.getAccountInfo(this.authService.user.username).subscribe({
      next: (res: any) => {
        console.log(res, 'get updated account info ');
        // this.formatPrescriberData(res.Payload.Providers);
        for (const provider of res.Payload.Providers) {
          this.providersWithAllFacilities = [
            ...this.providersWithAllFacilities,
            {
              NPI: provider.NPI,
              Name: provider.FirstName + ' ' + provider.LastName,
              facilities: provider.Facilities,
            },
          ];
        }

        this.getAllFacilities();

        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  // here we will get the all facilities of HCP working
  // shifted to add-hcp compo
  getAllFacilities(): void {
    this.sharedService.isLoading.next(true);
    this.authService.getFacilities().subscribe({
      next: (res: any) => {
        console.log(res, 'get facilities data');
        if (res.Status === 'SUCCESS') {
          this.hcpAllFacilities = res.Payload;
          this.facilitiesWithoutProvider = res.Payload;
          this.separateFacilities();
        } else {
          this.sharedService.notify('error', res.Errors[0]);
        }
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  // formatPrescriberData(providersData: any[]): void {
  //   for (const provider of providersData) {
  //     let providerDetails: any = {
  //       NPI: provider.NPI,
  //       name: provider.FirstName + ' ' + provider.LastName,
  //     };
  //     let facilities: any[] = [];
  //     for (const facility of provider.Facilities) {
  //       const updatedfacility = { ...facility, isSelected: true };
  //       facilities = [...facilities, updatedfacility];
  //     }
  //     providerDetails = { ...providerDetails, facilities };
  //     this.providersWithAllFacilities.push(providerDetails);
  //   }
  //   console.log(this.providersWithAllFacilities);
  // }

  //moved to add-healthcare
  separateFacilities(): void {
    for (const provider of this.providersWithAllFacilities) {
      let providerDetails: any = {
        NPI: provider.NPI,
        name: provider.FirstName + ' ' + provider.LastName,
      };
      let facilities: any[] = [];

      for (const facility of this.hcpAllFacilities) {
        for (const providerFacility of provider.Facilities) {
          if (facility.Id === providerFacility.Id) {
            const updatedfacility = { ...facility, isSelected: true };
            facilities = [...facilities, updatedfacility];

            // remove this from facilitiesWithout prescriber
            const index = this.facilitiesWithoutProvider.indexOf(facility);
            this.facilitiesWithoutProvider.splice(index, 1);
          }
        }
      }
      providerDetails = {
        ...providerDetails,
        ...this.facilitiesWithoutProvider,
        facilities,
      };
      this.providersWithSelectedFacilities.push(providerDetails);
    }
    console.log(
      this.providersWithSelectedFacilities,
      'providersWithSelectedFacilities'
    );
    console.log(this.facilitiesWithoutProvider, 'facilitiesWithoutProvider');
  }
}
