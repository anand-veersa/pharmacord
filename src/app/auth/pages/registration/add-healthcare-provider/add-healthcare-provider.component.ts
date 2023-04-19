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
export class AddHealthcareProviderComponent implements OnInit {
  @Input() componentTitle: string = '';
  @Input() componentSubTitle: string = '';
  @Input() requirementFor: string = '';
  @Input() selectedFacilities: Array<object> = [];
  @Output() collectPrescriberWithFacility = new EventEmitter<{
    prescribersWithSelectedFacility: Array<any>;
  }>();
  @Output() backToParentComponent = new EventEmitter<{
    backBtnClicked: boolean;
  }>();
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
  public accordianColumns: string[] = [
    'PracticeGroup',
    'Address',
    'Phone',
    'Fax',
    'Email',
  ];
  public facilities: Array<object> = [];
  public prescribersWithAllFacility: any[] = [];
  public prescribersWithSelectedFacility: any[] = [];
  public selectedFacility: object[] = [];

  public currentNPI: string = '';
  public npiData: any[] = [];
  public editNPI: string = '';
  // for account setting page
  public hcpAllFacilities: any[] = [];
  public providersWithAllFacilities: Array<any> = [];
  public providersWithSelectedFacilities: any[] = [];
  public providerAlreadyExist: boolean = false;
  public facilitiesWithoutProvider: any[] = [];

  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private authService: AuthService,
    private enrolService: EnrollmentService,
    public dialog: MatDialog
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

    if (this.requirementFor === 'accountSetting') {
      this.getUpdatedProviderDetails();
    }
  }

  navigateToPrevious(): void {
    this.backToParentComponent.emit({ backBtnClicked: true });
  }

  openTempDialog() {
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
    });
  }

  closeDialog(): void {
    if (this.editNPI !== '') {
      for (const npiObject in this.prescribersWithSelectedFacility) {
        if (
          this.prescribersWithSelectedFacility[npiObject].NPI === this.editNPI
        ) {
          this.prescribersWithSelectedFacility[npiObject].facilities =
            this.selectedFacility;
        }
      }
      this.editNPI = '';
    } else {
      this.prescribersWithSelectedFacility = [
        ...this.prescribersWithSelectedFacility,
        {
          NPI: this.currentNPI,
          facilities: this.selectedFacility,
          Name:
            this.addProviderForm.controls['HCPFirstName'].value +
            ' ' +
            this.addProviderForm.controls['HCPLastName'].value,
        },
      ];
    }
    console.log(
      this.prescribersWithSelectedFacility,
      this.npiData,
      'NPI table data'
    );
    this.selectedFacility = [];
    this.currentNPI = '';
    this.addProviderForm.reset();
  }

  getCompleteAddress(elementObject: any): string {
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

  getPrescriberName(NPI: string): string {
    if (NPI === 'recently added') {
      const lastObj = this.npiData[this.npiData.length - 1];
      return lastObj.FirstName + ' ' + lastObj.LastName;
    }
    const values = this.npiData.find(obj => obj.NPI === NPI);
    return values.FirstName + ' ' + values.LastName;
  }

  checkProviderDetails(): void {
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

    if (searchedProviderIndex != -1) {
      this.editPrescriberFacilities(searchedProviderIndex);
      this.providerAlreadyExist = true;
      this.openTempDialog();
    } else {
      this.sharedService.isLoading.next(true);
      this.authService.getProviderDetails(payloadGetProviderDetails).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            console.log(res);

            this.facilities = res.Payload[0].Facilities;

            //if there is some selected facility already present
            this.selectedFacilities = this.selectedFacilities.map(facility => {
              return { ...facility, isSelected: true };
            });

            this.facilities = this.facilities.map(facility => {
              return { ...facility, isSelected: false };
            });

            this.facilities = [...this.selectedFacilities, ...this.facilities];
            console.log(
              [...this.facilities, ...this.selectedFacilities],
              'combined'
            );

            this.prescribersWithAllFacility = [
              ...this.prescribersWithAllFacility,
              {
                NPI: payloadGetProviderDetails.NPI,
                Name:
                  payloadGetProviderDetails.FirstName +
                  ' ' +
                  payloadGetProviderDetails.LastName,
                facilities: this.facilities,
              },
            ];
            console.log(
              this.prescribersWithAllFacility,
              'prescriber with all facilities after NPI call'
            );

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

  registrationCall(): void {
    this.collectPrescriberWithFacility.emit({
      prescribersWithSelectedFacility: this.prescribersWithSelectedFacility,
    });
  }

  toggleAccordian(): boolean {
    return !this.panelOpenState;
  }

  getCheckbox(facility: any): void {
    if (this.selectedFacility.includes(facility)) {
      this.selectedFacility = this.selectedFacility.filter(item => {
        return item !== facility;
      });
      facility['isSelected'] = false;
    } else {
      this.selectedFacility.push(facility);
      facility['isSelected'] = true;
    }
  }

  deletePrescriberValues(
    pescriberObject: object,
    prescriberIndex: number
  ): void {
    this.prescribersWithAllFacility.splice(prescriberIndex, 1);
    this.prescribersWithSelectedFacility.splice(prescriberIndex, 1);
    console.log(
      'all and selected after delete',
      this.prescribersWithAllFacility,
      this.prescribersWithSelectedFacility
    );
  }

  editPrescriberFacilities(prescriberIndex: number): void {
    console.log(
      this.prescribersWithAllFacility,
      'after edit click',
      this.prescribersWithAllFacility[prescriberIndex].facilities
    );
    this.facilities =
      this.prescribersWithAllFacility[prescriberIndex].facilities;
    this.editNPI = this.prescribersWithAllFacility[prescriberIndex].NPI;
    this.openTempDialog();
    this.selectedFacility = this.facilities.filter((facility: any) => {
      return facility.isSelected === true;
    });
  }

  getAllFacilities(): void {
    this.sharedService.isLoading.next(true);
    this.authService.getFacilities().subscribe({
      next: (res: any) => {
        console.log(res, 'get facilities data');
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

  getUpdatedProviderDetails(): void {
    this.sharedService.isLoading.next(true);
    this.enrolService.getAccountInfo(this.authService.user.username).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
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
          this.prescribersWithAllFacility = this.providersWithAllFacilities;

          this.getAllFacilities();
        }
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
    // this.sharedService.isLoading.next(false);
  }

  separateFacilities(): void {
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
    console.log(
      this.prescribersWithSelectedFacility,
      'prescribersWithSelectedFacility '
    );
    console.log(this.prescribersWithAllFacility, 'prescribersWithAllFacility');
    console.log(this.facilitiesWithoutProvider, 'facilities without provider');
  }
}
