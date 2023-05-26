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
  @Output() action = new EventEmitter();
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
    // this.hcpAllFacilities.forEach(facility => {
    //   facility.Address = [facility.Address];
    // });
    this.existingFacilities = [...this.hcpAllFacilities];
    if (this.requirementFor === 'accountSetting') {
      this.facilities = [...this.hcpAllFacilities];
    }
  }

  public onAction(actionType: string): void {
    const actionObj = {
      actionType,
      nextScreen: '',
    };

    if (actionType === 'next') {
      this.sendFacilityData();
      actionObj.nextScreen = 'add-healthcare-provider';
    } else if (
      actionType === 'back' &&
      this.requirementFor === 'prescriberRegistration'
    ) {
      actionObj.nextScreen = 'prescriberRegistration';
    } else if (
      actionType === 'back' &&
      this.requirementFor === 'othersRegistration'
    ) {
      actionObj.nextScreen = 'othersRegistration';
    }
    this.action.emit(actionObj);
  }

  public addFacility(): void {
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
      Fax: this.addFacilityForm.value.facilityFax.replace(/\D/g, ''),
      OfficeName: this.addFacilityForm.value.practiceName,
      Rank: 1,
      Id: null,
      Phone: this.addFacilityForm.value.facilityPhone.replace(/\D/g, ''),
      PhoneType: 'Office',
      Extension: null,
      Contacts: [],
    };
    this.facilities = [...this.facilities, facility];

    this.dataSource = [...this.dataSource, facility];

    this.table?.renderRows();
    this.facilitiesForAddHCPScreen = [
      ...this.facilitiesForAddHCPScreen,
      facility,
    ];
    this.addFacilityForm.reset();
  }

  public getCompleteAddress(AddressObject: any): string {
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

  private setValuesToForm(facilityData: any): void {
    this.addFacilityForm.setValue({
      practiceName: facilityData.PracticeGroup,
      facilityPhone: facilityData.Phone.replace(/\D/g, ''),
      facilityFax: facilityData.Fax.replace(/\D/g, ''),
      facilityEmail: facilityData.Email,
      facilityAddress1:
        facilityData.Address.Line1 || facilityData.Address[0].Line1,
      facilityAddress2:
        facilityData.Address.Line2 || facilityData.Address[0].Line2,
      facilityCity: facilityData.Address.City || facilityData.Address[0].City,
      facilityState:
        facilityData.Address.State || facilityData.Address[0].State,
      facilityZip:
        facilityData.Address.Zipcode || facilityData.Address[0].Zipcode,
    });
  }

  public editFacility(cellData: any, facilityIndex: number): void {
    this.setValuesToForm(cellData);
    this.editClickedIndex = facilityIndex;
    this.editClicked = true;
  }

  public deleteFacility(facilityIndex: number): void {
    if (this.existingFacilities.includes(this.facilities[facilityIndex])) {
      this.facilitiesToDelete.push(this.facilities[facilityIndex]);
    }

    this.facilities.splice(facilityIndex, 1);
    if (this.requirementFor === 'othersRegistration')
      this.facilitiesForAddHCPScreen.splice(facilityIndex, 1);
    this.table.renderRows();
  }

  public cancleEdit(): void {
    this.addFacilityForm.reset();
    this.editClicked = false;
    this.editClickedIndex = -2;
  }

  public updateFacility(): void {
    this.facilities[this.editClickedIndex].PracticeGroup =
      this.addFacilityForm.value.practiceName;
    this.facilities[this.editClickedIndex].phone =
      this.addFacilityForm.value.facilityPhone.replace(/\D/g, '');
    this.facilities[this.editClickedIndex].Fax =
      this.addFacilityForm.value.facilityFax.replace(/\D/g, '');
    this.facilities[this.editClickedIndex].Email =
      this.addFacilityForm.value.facilityEmail;
    if (this.requirementFor === 'accountSetting') {
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
    } else {
      this.facilities[this.editClickedIndex].Address[0].Line1 =
        this.addFacilityForm.value.facilityAddress1;
      this.facilities[this.editClickedIndex].Address[0].Line2 =
        this.addFacilityForm.value.facilityAddress2;
      this.facilities[this.editClickedIndex].Address[0].State =
        this.addFacilityForm.value.facilityState;
      this.facilities[this.editClickedIndex].Address[0].City =
        this.addFacilityForm.value.facilityCity;
      this.facilities[this.editClickedIndex].Address[0].Zipcode =
        this.addFacilityForm.value.facilityZip;
    }
    // this.dataSource = [];
    // this.dataSource = [...this.facilities];
    // this.table?.renderRows();
    if (this.requirementFor === 'accountSetting') {
      this.facilitiesToUpdate = [
        ...this.facilitiesToUpdate,
        this.facilities[this.editClickedIndex],
      ];
    }

    this.cancleEdit();
  }

  public sendFacilityData(): void {
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
