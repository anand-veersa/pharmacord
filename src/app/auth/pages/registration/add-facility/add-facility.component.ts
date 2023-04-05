import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.scss'],
})
export class AddFacilityComponent implements OnInit {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() requirementFor: string = '';
  @Output() backToParentComponent = new EventEmitter<{
    backBtnClicked: boolean;
  }>();
  @Output() navigateToNextComponent = new EventEmitter<{
    nextBtnClicked: boolean;
  }>();
  @Output() masterFacilities = new EventEmitter<{ facilities: Array<any> }>();
  public facilities: Array<any> = [];
  public addFacilityFormData: JsonFormData;
  public addFacilityForm: FormGroup;
  public editClickedIndex: number = -2;
  public editClicked: boolean = false;
  public displayedColumns: Array<string> = [
    'PracticeGroup',
    'Address',
    'Phone',
    'Fax',
    'Email',
    'Edit/Delete',
  ];
  public dataSource = this.facilities;
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
  constructor(private sharedService: SharedService, private http: HttpClient) {}
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

  navigateToPrevious(): void {
    this.backToParentComponent.emit({ backBtnClicked: true });
  }

  navigateToNext(): void {
    this.navigateToNextComponent.emit({ nextBtnClicked: true });
  }

  addFacility(): void {
    const facility = {
      Address: [
        {
          City: this.addFacilityForm.value.facilityCity,
          Line1: this.addFacilityForm.value.facilityAddress1,
          Line2: this.addFacilityForm.value.facilityAddress2,
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
      PhoneType: 'office',
      Extension: null,
      Contacts: [],
    };
    this.facilities.push(facility);
    this.addFacilityForm.reset();
    this.dataSource = [...this.dataSource, facility];
    this.table?.renderRows();
    console.log(this.facilities);
  }

  getCompleteAddress(AddressObject: any): string {
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

  setValuesToForm(formValues: any): void {
    this.addFacilityForm.setValue({
      practiceName: formValues.PracticeGroup,
      facilityPhone: formValues.Phone,
      facilityFax: formValues.Fax,
      facilityEmail: formValues.Email,
      facilityAddress1: formValues.Address[0].Line1,
      facilityAddress2: formValues.Address[0].Line2,
      facilityCity: formValues.Address[0].City,
      facilityState: formValues.Address[0].State,
      facilityZip: formValues.Address[0].Zipcode,
    });
  }

  editFacility(cellData: any, facilityIndex: number): void {
    this.setValuesToForm(cellData);
    this.editClickedIndex = facilityIndex;
    this.editClicked = true;
  }

  deleteFacility(facilityIndex: number): void {
    this.facilities.splice(facilityIndex, 1);
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
    this.dataSource = [...this.facilities];
    this.table?.renderRows();
    this.cancleEdit();
  }

  sendFacilityData(): void {
    this.masterFacilities.emit({ facilities: this.facilities });
  }
}
