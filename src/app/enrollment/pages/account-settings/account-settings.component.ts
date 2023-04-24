import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EnrollmentService } from '../../enrollment.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { from } from 'rxjs';

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

  //for add healthcare
  public prescribersWithAllFacility: any[];
  public prescribersWithSelectedFacility: any[] = [];
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    private enrolService: EnrollmentService,
    private sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('init of account setting');
    this.getAllFacilities();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
            this.getUpdatedProviderDetails();
            this.getAllFacilities();
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

  deleteProviderWithFacilities(eventData: { deletePrescribers: string[] }) {
    console.log(
      'delete the prescriber with the ID ',
      eventData.deletePrescribers
    );
    // Url: https://ext-api.pharmacord.com/portaldev/api/v1.0/portal/account/deleteProvider/386
    const deletePrescriber = eventData.deletePrescribers;

    if (deletePrescriber.length > 0) {
      this.sharedService.isLoading.next(true);
      this.enrolService.deleteProvider(deletePrescriber).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            console.log('delete provider API success with res', res);
          }

          this.sharedService.isLoading.next(false);
        },
        error: err => {
          this.sharedService.notify('error', err);
          this.sharedService.isLoading.next(false);
        },
      });
    }
  }

  updateProviderCall(eventData: { prescribersWithSelectedFacility: any[] }) {
    let prescriberForUpdateCall: any[] = [];

    for (const prescriberNewData of eventData.prescribersWithSelectedFacility) {
      const index = this.prescribersWithSelectedFacility.findIndex(
        prescriber => prescriber.NPI == prescriberNewData.NPI
      );

      if (index === -1) {
        prescriberForUpdateCall = [
          ...prescriberForUpdateCall,
          prescriberNewData,
        ];
      }
      // } else {
      //   let newFacilities: any[] = [];
      //   for (const newFacility of prescriberNewData.facilities) {
      //     const index2 = this.prescribersWithSelectedFacility[
      //       index
      //     ].facilities.findIndex(
      //       (facility: any) => facility.Id === newFacility.Id
      //     );

      //     if (index2 !== -1) {
      //       newFacilities = [...newFacilities, prescriberNewData[index2]];
      //     }
      //   }
      //   prescriberNewData.facilities = [...newFacilities];
      //   prescriberForUpdateCall = [
      //     ...prescriberForUpdateCall,
      //     prescriberNewData,
      //   ];

      // }
    }

    console.log(prescriberForUpdateCall, 'prescriberForUpdateCall');
    // for (const prescriberOldData of this.prescribersWithSelectedFacility){
    //   for(const prescriberNewData of eventData.prescribersWithSelectedFacility){
    //     if (prescriberOldData.NPI === prescriberNewData.NPI){
    //         const newFacility
    //     }
    //   }
    // }

    if (prescriberForUpdateCall.length > 0) {
      // save or update new calls
      for (const provider of prescriberForUpdateCall) {
        let providerUpdatedFacilities: any[] = [];
        provider.facilities.forEach((facility: any) => {
          const updatedFacility = {
            PracticeGroup: facility.GroupName,
            Email: facility.Email,
            Fax: facility.Fax,
            OfficeName: facility.Name,
            Rank: 1,
            Id: facility.Id,
            Phone: facility.Phone,
            Extension: null,
            Address: {
              City: facility.City,
              Line1: facility.Address1,
              Line2: facility.Address2,
              State: facility.State,
              Zipcode: facility.Zip,
            },
            Contacts: [
              {
                Id: null,
                Email: this.authService.user.email,
                Fax: this.authService.user.fax,
                FirstName: this.authService.user.firstName,
                LastName: this.authService.user.lastName,
                OfficeContactType: 'Office Contact',
                Rank: 1,
                Title: null,
                Phone: this.authService.user.phone,
                Extension: null,
              },
            ],
          };

          providerUpdatedFacilities = [
            ...providerUpdatedFacilities,
            updatedFacility,
          ];
        });

        provider.facilities = [...providerUpdatedFacilities];
        const updateFacilityPayload = {
          Username: this.authService.user.username,
          MasterAccountId: this.authService.user.portalAccountPkId,
          IsNewUser: false,
          PrescriberId: provider.PrescriberId,
          Facilities: provider.facilities,
        };

        this.enrolService.updateFacility(updateFacilityPayload).subscribe({
          next: (res: any) => {
            if (res.Status === 'SUCCESS') {
              console.log('new prescriber added and Response is', res);
            }
          },
          error: err => {
            this.sharedService.notify('error', err);
            this.sharedService.isLoading.next(false);
          },
        });
      }
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
              AccountStatus: provider.AccountStatus,
              PrescriberId: provider.PortalAccountPkId,
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

  updateFacilitiesCall(eventData: { facilitiesToUpdate: any[] }): void {
    if (eventData.facilitiesToUpdate.length > 0) {
      for (const facilityData of eventData.facilitiesToUpdate) {
        facilityData.Address = {
          ...facilityData.Address,
          ZipCode: facilityData.Address.Zipcode,
        };

        delete facilityData.Address.Zipcode;
        delete facilityData.Address.Suite;

        const updateFacilityPayload = {
          PortalAccountId: this.authService.user.portalAccountPkId,
          FacilityId: facilityData.Id,
          Address: facilityData.Address,
          Phone: facilityData.Phone,
          Fax: facilityData.Fax,
          Email: facilityData.Email,
        };
        this.sharedService.isLoading.next(true);
        this.enrolService.updateFacilityData(updateFacilityPayload).subscribe({
          next: (res: any) => {
            if (res.Status === 'SUCCESS') {
              console.log(res, 'response after updating the facility data');
            }
            this.sharedService.isLoading.next(false);
          },
          error: err => {
            this.sharedService.isLoading.next(false);
            this.sharedService.notify('error', err);
          },
        });
      }
    }
  }

  // here we will get the all facilities of HCP working
  // shifted to add-hcp compo
  getAllFacilities(): void {
    this.sharedService.isLoading.next(true);
    this.enrolService.getFacilities().subscribe({
      next: (res: any) => {
        console.log(res, 'get facilities data');
        if (res.Status === 'SUCCESS') {
          this.hcpAllFacilities = res.Payload;
          this.facilitiesWithoutProvider = [...res.Payload];
          this.separateFacilities();
          this.sharedService.isLoading.next(false);
        } else {
          this.sharedService.notify('error', res.Errors[0]);
          this.sharedService.isLoading.next(false);
        }
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  //moved to add-healthcare
  separateFacilities(): void {
    const prescriberData = this.authService.user.prescribers;

    for (const provider of prescriberData) {
      this.providersWithAllFacilities = [
        ...this.providersWithAllFacilities,
        {
          NPI: provider.NPI,
          Name: provider.FirstName + ' ' + provider.LastName,
          facilities: provider.Facilities,
          AccountStatus: provider.AccountStatus,
          PrescriberId: provider.ProviderId,
        },
      ];
    }

    this.hcpAllFacilities.forEach(facility => {
      facility.Adress = { ...facility.Address[0] };
    });

    for (const provider of this.providersWithAllFacilities) {
      let providerDetails: any = {
        NPI: provider.NPI,
        Name: provider.Name,
        AccountStatus: provider.AccountStatus,
        PrescriberId: provider.PrescriberId,
      };
      let facilities: any[] = [];
      for (const facility of this.hcpAllFacilities) {
        for (const providerFacility of provider.facilities) {
          if (facility.Id === providerFacility.Id) {
            const updatedfacility = { ...facility, isSelected: true };
            facilities = [...facilities, updatedfacility];
            // place true to facility in allfacilities
            // providerFacility = { ...providerFacility, isSelected: true };
            providerFacility.isSelected = true;

            // remove this from facilitiesWithout prescriber
            const index = this.facilitiesWithoutProvider.indexOf(facility);
            this.facilitiesWithoutProvider.splice(index, 1);
          }
        }
      }
      providerDetails = { ...providerDetails, facilities };
      this.providersWithSelectedFacilities.push(providerDetails);
    }

    this.facilitiesWithoutProvider.forEach(facility => {
      facility.isSelected = true;
    });
    for (const provider of this.providersWithSelectedFacilities) {
      provider.facilities = [
        ...this.facilitiesWithoutProvider,
        ...provider.facilities,
      ];
    }
    this.prescribersWithSelectedFacility = this.providersWithSelectedFacilities;
    this.prescribersWithAllFacility = this.providersWithAllFacilities;
  }
}
