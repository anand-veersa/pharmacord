import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.scss'],
})
export class AddFacilityComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() requirementFor: string = '';
  @Input() hcpAllFacilities: any[] = []; // for account settings
  @Output() backToParentComponent = new EventEmitter<{
    backBtnClicked: boolean;
  }>();
  @Output() navigateToNextComponent = new EventEmitter<{
    nextBtnClicked: boolean;
  }>();
  @Output() updateFacilities = new EventEmitter<{
    facilitiesToUpdate: any[];
  }>();
  @Output() masterFacilities = new EventEmitter<{ facilities: Array<any> }>();
  @Output() deleteFacilities = new EventEmitter<{ facilities: Array<any> }>();
  public facilities: Array<any> = [];
  public facilitiesToDelete: Array<any> = [];
  public addFacilityFormData: JsonFormData;
  public addFacilityForm: FormGroup;
  public editClickedIndex: number = -2;
  public editClicked: boolean = false;
  public existingFacilities: any[] = [];
  public facilitiesToUpdate: any[] = []; // update a particular facility in account setting
  public displayedColumns: Array<string> = [
    'PracticeGroup',
    'Address',
    'Phone',
    'Fax',
    'Email',
    'Edit/Delete',
  ];
  public dataSource = this.facilities;
  public facilitiesForAddHCPScreen: object[] = [];
  @ViewChild(MatTable) table: MatTable<any>;
  //form control values
  // public PracticeGroup: string;
  // public Email: string;
  // public Fax: string;
  // public OfficeName: string;
  // public Rank: 1;
  // public Id: string;
  // public Phone: string;
  // public PhoneType: string;
  // public Extension: null;
  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.http
      .get('/assets/json/add-facility-information-form.json')
      .subscribe((formData: any) => {
        this.addFacilityFormData = formData;
        this.addFacilityForm = this.sharedService.buildForm(
          this.addFacilityFormData
        );
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.existingFacilities = [...this.hcpAllFacilities];
    console.log(
      'ngonchanges of add facility with exisitingfacilities as ',
      this.existingFacilities
    );

    if (this.requirementFor === 'accountSetting') {
      this.facilities = [...this.hcpAllFacilities];
    }
  }

  navigateToPrevious(): void {
    this.backToParentComponent.emit({ backBtnClicked: true });
  }

  navigateToNext(): void {
    this.navigateToNextComponent.emit({ nextBtnClicked: true });
    this.sendFacilityData();
  }

  addFacility(): void {
    const facility = {
      Address: [
        {
          City: this.addFacilityForm.value.facilityCity,
          Line1: this.addFacilityForm.value.facilityAddress1,
          Line2:
            this.addFacilityForm.value.facilityAddress2 === ''
              ? null
              : this.addFacilityForm.value.facilityAddress2,
          State: this.addFacilityForm.value.facilityState,
          Zipcode: this.addFacilityForm.value.facilityZip,
        },
      ],
      PracticeGroup: this.addFacilityForm.value.practiceName,
      Email: this.addFacilityForm.value.facilityEmail,
      Fax: this.addFacilityForm.value.facilityFax,
      OfficeName: this.addFacilityForm.value.practiceName,
      Rank: 1,
      Id: null,
      Phone: this.addFacilityForm.value.facilityPhone,
      PhoneType: 'Office',
      Extension: null,
      Contacts: [],
    };
    this.facilities = [...this.facilities, facility];

    this.dataSource = [...this.dataSource, facility];

    this.table?.renderRows();

    // if (this.requirementFor === 'othersRegistration') {
    //   const facility = {
    //     ///
    //     Id: null,
    //     Name: this.addFacilityForm.value.practiceName,
    //     GroupName: this.addFacilityForm.value.practiceName,
    //     Address1: this.addFacilityForm.value.facilityAddress1,
    //     Address2:
    //       this.addFacilityForm.value.facilityAddress2 === ''
    //         ? null
    //         : this.addFacilityForm.value.facilityAddress2,
    //     City: this.addFacilityForm.value.facilityCity,
    //     County: null,
    //     State: this.addFacilityForm.value.facilityState,
    //     Phone: this.addFacilityForm.value.facilityPhone,
    //     Fax: this.addFacilityForm.value.facilityFax,
    //     Email: this.addFacilityForm.value.facilityEmail,
    //     Zip: this.addFacilityForm.value.facilityZip,
    //     ZipSuffixCode: '',
    //     isSelected: true,
    //   };
    //   this.facilitiesForAddHCPScreen = [
    //     ...this.facilitiesForAddHCPScreen,
    //     facility,
    //   ];
    // }
    this.facilitiesForAddHCPScreen = [
      ...this.facilitiesForAddHCPScreen,
      facility,
    ];
    this.addFacilityForm.reset();
  }

  getCompleteAddress(AddressObject: any): string {
    // if (AddressObject.length === 1) {
    //   if (AddressObject.Line2 !== null) {
    //     return (
    //       AddressObject[0].Line1 +
    //       ', ' +
    //       AddressObject[0].Line2 +
    //       ', ' +
    //       AddressObject[0].City +
    //       ', ' +
    //       AddressObject[0].State +
    //       ', ' +
    //       AddressObject[0].Zipcode
    //     );
    //   }
    //   return (
    //     AddressObject[0].Line1 +
    //     ', ' +
    //     AddressObject[0].City +
    //     ', ' +
    //     AddressObject[0].State +
    //     ', ' +
    //     AddressObject[0].Zipcode
    //   );
    // }
    if (AddressObject.Line2 !== null) {
      return (
        AddressObject.Line1 +
        ', ' +
        AddressObject.Line2 +
        ', ' +
        AddressObject.City +
        ', ' +
        AddressObject.State +
        ', ' +
        AddressObject.Zipcode
      );
    }
    return (
      AddressObject.Line1 +
      ', ' +
      AddressObject.City +
      ', ' +
      AddressObject.State +
      ', ' +
      AddressObject.Zipcode
    );
  }

  setValuesToForm(facilityData: any): void {
    this.addFacilityForm.setValue({
      practiceName: facilityData.PracticeGroup,
      facilityPhone: facilityData.Phone,
      facilityFax: facilityData.Fax,
      facilityEmail: facilityData.Email,
      facilityAddress1: facilityData.Address.Line1,
      facilityAddress2:
        facilityData.Address.Line2 === '' ? null : facilityData.Address.Line2,
      facilityCity: facilityData.Address.City,
      facilityState: facilityData.Address.State,
      facilityZip: facilityData.Address.Zipcode,
    });
  }

  editFacility(cellData: any, facilityIndex: number): void {
    this.setValuesToForm(cellData);
    this.editClickedIndex = facilityIndex;
    this.editClicked = true;
  }

  deleteFacility(facilityIndex: number): void {
    if (this.existingFacilities.includes(this.facilities[facilityIndex])) {
      this.facilitiesToDelete.push(this.facilities[facilityIndex]);
    }

    this.facilities.splice(facilityIndex, 1);
    if (this.requirementFor === 'othersRegistration')
      this.facilitiesForAddHCPScreen.splice(facilityIndex, 1);
    this.table.renderRows();
  }

  cancleEdit(): void {
    this.addFacilityForm.reset();
    this.editClicked = false;
    this.editClickedIndex = -2;
  }

  updateFacility(): void {
    this.facilities[this.editClickedIndex].PracticeGroup =
      this.addFacilityForm.value.practiceName;
    this.facilities[this.editClickedIndex].phone =
      this.addFacilityForm.value.facilityPhone;
    this.facilities[this.editClickedIndex].Fax =
      this.addFacilityForm.value.facilityFax;
    this.facilities[this.editClickedIndex].Email =
      this.addFacilityForm.value.facilityEmail;

    this.facilities[this.editClickedIndex].Address.Line1 =
      this.addFacilityForm.value.facilityAddress1;
    this.facilities[this.editClickedIndex].Address.Line2 =
      this.addFacilityForm.value.facilityAddress2;
    this.facilities[this.editClickedIndex].Address.State =
      this.addFacilityForm.value.facilityState;
    this.facilities[this.editClickedIndex].Address.City =
      this.addFacilityForm.value.facilityCity;
    this.facilities[this.editClickedIndex].Address.Zipcode =
      this.addFacilityForm.value.facilityZip;
    this.dataSource = [...this.facilities];
    this.table?.renderRows();

    if (this.requirementFor === 'accountSetting') {
      this.facilitiesToUpdate = [
        ...this.facilitiesToUpdate,
        this.facilities[this.editClickedIndex],
      ];
    }

    this.cancleEdit();
  }

  sendFacilityData(): void {
    const filterFacilities = [];
    for (const facility of this.facilities) {
      if (!this.existingFacilities.includes(facility)) {
        filterFacilities.push(facility);
      }
    }

    if (this.requirementFor === 'othersRegistration') {
      this.masterFacilities.emit({
        facilities: this.facilitiesForAddHCPScreen,
      });
    } else {
      this.masterFacilities.emit({ facilities: filterFacilities });
      this.updateFacilities.emit({
        facilitiesToUpdate: this.facilitiesToUpdate,
      });
    }
    this.deleteFacilities.emit({ facilities: this.facilitiesToDelete });
  }
}
