import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AuthService } from 'src/app/auth/auth.service';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { EnrollmentService } from 'src/app/enrollment/enrollment.service';

@Component({
  selector: 'app-add-healthcare-provider',
  templateUrl: './add-healthcare-provider.component.html',
  styleUrls: ['./add-healthcare-provider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddHealthcareProviderComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() componentTitle: string = '';
  @Input() componentSubTitle: string = '';
  @Input() requirementFor: string = '';
  @Input() newOnboardingFacilities: any[] = []; // from onboarding previous screen
  @Input() providersWithAllFacilities: Array<any> = [];
  @Input() providersWithSelectedFacilities: any[] = [];
  @Output() collectPrescriberWithFacility = new EventEmitter<{
    prescribersWithSelectedFacility: Array<any>;
  }>();
  @Output() prescriberToDelete = new EventEmitter<{
    deletePrescribers: string[];
  }>();
  @Output() backToParentComponent = new EventEmitter<{
    backBtnClicked: boolean;
  }>();
  @Output() action = new EventEmitter();
  public addProviderFormData: JsonFormData;
  public addProviderForm: FormGroup;
  public panelOpenState: boolean;
  public dialogDisplayedColumns: string[] = [
    'Checkbox',
    'PracticeGroup',
    'Address',
    'Phone',
    'Fax',
    'Email',
  ];
  public accordionColumns: string[] = [
    'PracticeGroup',
    'Address',
    'Phone',
    'Fax',
    'Email',
  ];
  public accountSettingAccordionColumns: string[] = [
    'PracticeGroup',
    'Address',
    'Phone',
    'Fax',
    'Email',
    'Status',
  ];
  public facilities: Array<object> = [];
  public prescribersWithAllFacility: any[] = [];
  public prescribersWithSelectedFacility: any[] = [];
  public selectedFacilityInProgress: object[] = [];

  public currentNPI: string = '';
  public currentPrescriberId: string = '';
  public npiData: any[] = [];
  public editNPI: string = '';
  public disableDialougeBtn: boolean = false;
  // for account setting page
  public hcpAllFacilities: any[] = [];
  public providerAlreadyExist: boolean = false;
  public facilitiesWithoutProvider: any[] = [];
  public deletePrescribers: string[] = [];

  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private authService: AuthService,
    private enrolService: EnrollmentService,
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.http
      .get('/assets/json/add-provider-form.json')
      .subscribe((formData: any) => {
        this.addProviderFormData = formData;
        this.addProviderForm = this.sharedService.buildForm(
          this.addProviderFormData
        );
      });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requirementFor === 'accountSetting') {
      this.prescribersWithSelectedFacility = [
        ...this.providersWithSelectedFacilities,
      ];
      this.prescribersWithAllFacility = [...this.providersWithAllFacilities];
    } else if (this.requirementFor === 'othersRegistration') {
      this.prescribersWithAllFacility = [];
      this.prescribersWithSelectedFacility = [];
    }
  }

  public onAction(actionType: string): void {
    const actionObj = {
      actionType,
      nextScreen: '',
    };

    if (actionType === 'back') {
      this.prescribersWithAllFacility = [];
      this.selectedFacilityInProgress = [];
      this.prescribersWithSelectedFacility = [];
      this.addProviderForm.reset();
      actionObj.nextScreen = 'add-facility-others';
    }

    this.action.emit(actionObj);
  }

  public openTempDialog() {
    const myCompDialog = this.dialog.open(this.dialogRef, {
      data: this.facilities,
      panelClass: 'fullscreen-dialog',
      height: '60vh',
      width: '72vw',
    });
    myCompDialog.afterOpened().subscribe(res => {
      // Trigger After Dialog Opened
      this.table?.renderRows;
      console.log('After Opened', { res });
    });
    myCompDialog.beforeClosed().subscribe(res => {
      // Trigger Before Dialog Closed
      console.log('Before Closed', { res });
    });
    myCompDialog.afterClosed().subscribe(res => {
      // Trigger After Dialog Closed
      console.log('After Closed', { res });
      this.selectedFacilityInProgress = [];
    });
  }

  public closeDialog(): void {
    if (this.editNPI !== '') {
      for (const npiObject in this.prescribersWithSelectedFacility) {
        if (
          this.prescribersWithSelectedFacility[npiObject].NPI === this.editNPI
        ) {
          this.prescribersWithSelectedFacility[npiObject].facilities =
            this.selectedFacilityInProgress;
        }
      }
      this.editNPI = '';
    } else {
      this.prescribersWithSelectedFacility = [
        ...this.prescribersWithSelectedFacility,
        {
          NPI: this.currentNPI,
          facilities: this.selectedFacilityInProgress,
          Name:
            this.addProviderForm.controls['HCPFirstName'].value +
            ' ' +
            this.addProviderForm.controls['HCPLastName'].value,
          PrescriberId: this.currentPrescriberId,
        },
      ];
    }
    this.selectedFacilityInProgress = [];
    this.currentNPI = '';
    this.currentPrescriberId = '';
    this.addProviderForm.reset();
  }

  public getCompleteAddress(elementObject: any): string {
    if (elementObject.Address2 !== null || elementObject.Line2 !== null) {
      return (
        (elementObject.Address1 === undefined
          ? elementObject.Line1
          : elementObject.Address1) +
        ', ' +
        (elementObject.Address2 === undefined
          ? elementObject.Line2
          : elementObject.Address2) +
        ', ' +
        elementObject.City +
        ', ' +
        elementObject.State +
        ', ' +
        elementObject.Zipcode
      );
    }
    return (
      elementObject.Address1 +
      ', ' +
      elementObject.City +
      ', ' +
      elementObject.State +
      ', ' +
      elementObject.Zip
    );
  }

  public getPrescriberName(NPI: string): string {
    if (NPI === 'recently-added') {
      const lastObj = this.npiData[this.npiData.length - 1];
      return lastObj.FirstName + ' ' + lastObj.LastName;
    } else {
      for (const prescriber of this.prescribersWithAllFacility) {
        if (prescriber.NPI == NPI) {
          return prescriber.Name;
        }
      }
    }
    return '';
  }

  public checkProviderDetails(): void {
    this.currentNPI = this.addProviderForm.controls['HCPNPI'].value;
    const payloadGetProviderDetails = {
      NPI: this.addProviderForm?.get('HCPNPI')?.value,
      FirstName: this.addProviderForm?.get('HCPFirstName')?.value,
      LastName: this.addProviderForm?.get('HCPLastName')?.value,
    };
    // debugger;
    const searchedProviderIndex = this.prescribersWithAllFacility.findIndex(
      provider => provider.NPI === this.currentNPI
    );

    //check if already existing
    if (searchedProviderIndex != -1) {
      this.editPrescriberFacilities(searchedProviderIndex);
      this.providerAlreadyExist = true;
    } else {
      //apicall
      this.sharedService.isLoading.next(true);
      this.authService.getProviderDetails(payloadGetProviderDetails).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            this.currentPrescriberId = res.Payload[0].Id;
            this.facilities = res.Payload[0].Facilities;

            //adding key to an objects
            this.facilities = this.facilities.map((facility: any) => {
              return {
                ...facility,
                isSelected: false,
                OfficeName: facility.GroupName,
              };
            });

            if (this.requirementFor === 'othersRegistration') {
              this.facilities = [
                ...this.newOnboardingFacilities,
                ...this.facilities,
              ];

              this.selectedFacilityInProgress = [
                ...this.newOnboardingFacilities,
              ];
            }

            this.prescribersWithAllFacility = [
              ...this.prescribersWithAllFacility,
              {
                NPI: payloadGetProviderDetails.NPI,
                Name:
                  payloadGetProviderDetails.FirstName +
                  ' ' +
                  payloadGetProviderDetails.LastName,
                facilities: this.facilities,
                PrescriberId: res.Payload[0].Id,
              },
            ];

            this.openTempDialog();
            this.npiData.push(payloadGetProviderDetails);
          } else {
            this.sharedService.notify('error', res.Errors[0].Message);
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

  public registrationCall(): void {
    this.collectPrescriberWithFacility.emit({
      prescribersWithSelectedFacility: this.prescribersWithSelectedFacility,
    });

    this.prescribersWithSelectedFacility = [];

    if (this.requirementFor === 'accountSetting') {
      this.prescriberToDelete.emit({
        deletePrescribers: this.deletePrescribers,
      });

      this.deletePrescribers = [];
    }
  }

  public toggleAccordion(): boolean {
    return !this.panelOpenState;
  }

  public getCheckbox(facility: any): void {
    if (this.selectedFacilityInProgress.includes(facility)) {
      this.selectedFacilityInProgress = this.selectedFacilityInProgress.filter(
        item => {
          return item !== facility;
        }
      );
      facility['isSelected'] = false;
      if (this.newOnboardingFacilities.includes(facility)) {
        const index = this.newOnboardingFacilities.indexOf(facility);
        this.newOnboardingFacilities[index].isSelected = false;
      }
    } else {
      this.selectedFacilityInProgress.push(facility);
      facility['isSelected'] = true;
      if (this.newOnboardingFacilities.includes(facility)) {
        const index = this.newOnboardingFacilities.indexOf(facility);
        this.newOnboardingFacilities[index].isSelected = true;
        this.disableDialougeBtn = false;
      }
    }

    // check all facility from prevOnboarding screens are fine
    this.newOnboardingFacilities.forEach(facility => {
      if (facility.isSelected === false) {
        this.disableDialougeBtn = true;
      }
    });
  }

  public deletePrescriberValues(
    pescriberObject: object,
    prescriberIndex: number
  ): void {
    this.deletePrescribers.push(
      this.prescribersWithAllFacility[prescriberIndex].PrescriberId
    );
    this.prescribersWithAllFacility.splice(prescriberIndex, 1);
    this.prescribersWithSelectedFacility.splice(prescriberIndex, 1);
  }

  public editPrescriberFacilities(prescriberIndex: number): void {
    this.facilities =
      this.prescribersWithAllFacility[prescriberIndex].facilities;
    this.editNPI = this.prescribersWithAllFacility[prescriberIndex].NPI;
    this.openTempDialog();
    this.selectedFacilityInProgress = this.facilities.filter(
      (facility: any) => {
        return facility.isSelected === true;
      }
    );
  }

  private getAllFacilities(): void {
    this.sharedService.isLoading.next(true);
    this.enrolService.getFacilities().subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          this.hcpAllFacilities = res.Payload;
          this.facilitiesWithoutProvider = [...res.Payload];
          this.separateFacilities();
        } else {
          this.sharedService.notify('error', res.Errors[0]);
        }
        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  private separateFacilities(): void {
    for (const provider of this.providersWithAllFacilities) {
      let providerDetails: any = {
        NPI: provider.NPI,
        Name: provider.Name,
      };
      let facilities: any[] = [];
      for (const facility of this.hcpAllFacilities) {
        for (const providerFacility of provider.facilities) {
          if (facility.Id === providerFacility.Id) {
            const updatedfacility = { ...facility, isSelected: true };
            facilities = [...facilities, updatedfacility];
            providerFacility.isSelected = true;
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
