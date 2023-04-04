import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { Patient } from 'src/app/models/cases.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { EnrollmentService } from '../../enrollment.service';

@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.component.html',
  styleUrls: ['./my-patients.component.scss'],
})
export class MyPatientsComponent implements OnInit {
  public cases = new MatTableDataSource<Patient>([]);
  public filteredCases = new MatTableDataSource<Patient>([]);
  public displayedColumns: string[] = [];
  public columnSchema: any[] = [];
  public pageSizeOptions: number[] = [10, 20, 50];
  public searchForm: FormGroup;
  public searchField: JsonFormControls;
  constructor(
    private enrolService: EnrollmentService,
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.http.get('/assets/json/patients-table.json').subscribe((data: any) => {
      this.columnSchema = data.columns;
      data.columns.map((column: any) => {
        this.displayedColumns.push(column.key);
      });
    });
  }

  ngOnInit() {
    this.enrolService.medicineCases.subscribe((data: any[]) => {
      const dataCasesByPatient = this.sharedService.getPatients(data);
      this.createTableData(dataCasesByPatient);
    });
    this.searchField = {
      name: 'search',
      label: '',
      value: '',
      type: 'search',
      placeholder: 'Search',
    };
    this.searchForm = this.sharedService.buildForm({
      controls: [this.searchField],
    });
  }

  public patientSelected(patient: Patient): void {
    this.router.navigate([`${patient.PatientId}`], {
      queryParams: { case: patient.CaseId },
      relativeTo: this.route,
    });
  }

  public filterPatients(): void {
    this.filteredCases.data = this.sharedService.filterSearch(
      this.searchForm.value?.search,
      this.cases?.data
    );
  }

  private createTableData(patientCases: any): void {
    const cases: any[] = [];
    patientCases.forEach((item: any) => {
      const patientCase = {
        PatientId: item.PatientId,
        CaseId: item.CaseId,
        FirstName: item.PatientName.split(' ')[0],
        LastName: item.PatientName.split(' ').at(-1),
        DateOfBirth: item.DateOfBirth,
        Prescriber: this.sharedService.getPrescriberName(item['prescriberId ']),
        DateSubmitted: this.sharedService.getFormattedDate(item.CaseStartDate),
        EnrollmentStatus: item.EnrollmentStatus,
        Product: item.DrugGroup.Value,
        ActionNeeded: item.ActionNeeded ? 'Yes' : 'No',
      };
      cases.push(patientCase);
    });
    this.cases.data = cases;
    this.filteredCases.data = cases;
  }
}
