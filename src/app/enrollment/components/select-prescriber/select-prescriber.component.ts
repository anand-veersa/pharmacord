import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PrescriberFacility } from 'src/app/models/enrollment-form.model';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-prescriber',
  templateUrl: './select-prescriber.component.html',
  styleUrls: ['./select-prescriber.component.scss'],
})
export class SelectPrescriberComponent implements OnInit, OnDestroy {
  @Input() selectedMedication: string = '';
  @Input() prescriberFacilities: any[];
  @Output() prescriberList = new EventEmitter();
  @Output() action = new EventEmitter();
  @Output() prescribersFormData = new EventEmitter();
  public facilities = new MatTableDataSource<PrescriberFacility>([]);
  public displayedColumns: string[] = [];
  public columnSchema: any[] = [];
  public pageSizeOptions: number[] = [10, 20, 50];
  public subscription: Subscription;
  public selectedPrescriber: any;

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http
      .get('/assets/json/facilities-table.json')
      .subscribe((data: any) => {
        this.columnSchema = data.columns;
        data.columns.map((column: any) => {
          if (column.key === 'FacilityId') return;
          this.displayedColumns.push(column.key);
        });
        this.submitEnrolService.headerTitle.next(
          `Submit ${this.submitEnrolService.enrollmentFormPayload.DrugGroup} Enrollment Form`
        );
        this.submitEnrolService.createSelectPrescriberForm();
        this.prescribersFormData.emit({
          prescriberListJson: this.submitEnrolService.prescribersJson,
          selectPrescriberForm: this.submitEnrolService.prescriberForm,
        });
        // this.getPrescriberFacilities(this.submitEnrolService.selectedFacilityId);
        this.subscription =
          this.submitEnrolService.selectedPrescriberId.subscribe(
            (prescriberId: number) => {
              if (!prescriberId) return;
              this.getPrescriberFacilities(prescriberId);
            }
          );
      });
  }

  public getPrescriberFacilities(prescriberId: number): void {
    if (!prescriberId) return;
    const prescriber = this.authService.user.prescribers.filter(
      pres => pres.ProviderId === prescriberId
    );
    this.submitEnrolService.selectedPrescriber = prescriber[0];
    this.prescriberFacilities =
      this.submitEnrolService.selectedPrescriber.Facilities;

    this.createTableData(this.submitEnrolService.selectedPrescriber.Facilities);
  }

  public facilitySelected(facility: any): void {
    this.submitEnrolService.selectedFacility = this.prescriberFacilities.filter(
      fac => fac.Id === facility.FacilityId
    );
    this.submitEnrolService.selectedFacilityId = facility.FacilityId;
  }

  public onAction(actionType: string): void {
    const actionObj = {
      actionType,
      formName: 'select-prescriber',
      form: this.submitEnrolService.selectedFacility
        ? this.submitEnrolService.selectedFacility[0]
        : null,
      nextScreen:
        actionType === 'back' ? 'select-medication' : 'select-services',
    };
    this.action.emit(actionObj);
  }

  private createTableData(facilities: any[]): void {
    const prescriberFacilities: PrescriberFacility[] = [];
    facilities.forEach(item => {
      const facility: PrescriberFacility = {
        FacilityId: item.Id,
        FacilityName: item.OfficeName || item.PracticeGroup,
        Address: `${item.Address.Line1} ${item.Address.Line2}, ${item.Address.City}, ${item.Address.State}, ${item.Address.Zipcode}`,
        Phone: item.Phone,
        Fax: item.Fax,
        Email: item.Email,
      };
      prescriberFacilities.push(facility);
    });
    this.facilities.data = prescriberFacilities;
  }

  ngOnDestroy(): void {
    this.facilities.data = [];
    this.subscription.unsubscribe();
  }
}
