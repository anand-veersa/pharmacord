import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Subscription } from 'rxjs';
import { Alert, Case, CaseDoc } from 'src/app/models/cases.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { EnrollmentService } from '../../enrollment.service';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  private routeSubs: Subscription;
  public patientCasesDataSource = new MatTableDataSource<Case>([]);
  public alertDataSource = new MatTableDataSource<Alert>([]);
  public docDataSource = new MatTableDataSource<CaseDoc>([]);
  public patientCases: any;
  public selectedCase: { key: string; value: any };
  public patientDemographics: { caseDetails: any; patientAddress: any } = {
    caseDetails: {},
    patientAddress: {},
  };
  public patientId: string;
  public caseDetail: any;
  public shippingData: any[];
  public caseDocuments: any[];
  public alerts: any[];
  public casesDisplayedColumns: string[] = [];
  public alertDisplayedColumns: string[] = [];
  public docDisplayedColumns: string[] = [];
  public caseColumnSchema: any[] = [];
  public alertColumnSchema: any[] = [];
  public docColumnSchema: any[] = [];
  public pageSizeOptions: number[] = [5, 10, 15];
  public pdfSrc: any = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private enrolService: EnrollmentService,
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.http.get('/assets/json/cases-table.json').subscribe((data: any) => {
      this.caseColumnSchema = data.columns;
      data.columns.map((column: any) => {
        this.casesDisplayedColumns.push(column.key);
      });
    });
    this.http.get('/assets/json/alerts-table.json').subscribe((data: any) => {
      this.alertColumnSchema = data.columns;
      data.columns.map((column: any) => {
        this.alertDisplayedColumns.push(column.key);
      });
    });
    this.http
      .get('/assets/json/case-documents-table.json')
      .subscribe((data: any) => {
        this.docColumnSchema = data.columns;
        data.columns.map((column: any) => {
          if (column.key === 'DocumentURL') return;
          this.docDisplayedColumns.push(column.key);
        });
      });
  }

  ngOnInit(): void {
    this.routeSubs = combineLatest([this.route.params, this.route.queryParams])
      .pipe(map(results => ({ params: results[0]['id'], query: results[1] })))
      .subscribe({
        next: results => {
          this.patientId = results.params;
          this.sharedService.isLoading.next(true);
          this.enrolService.cases.subscribe((cases: any[]) => {
            this.patientCases = [];
            cases.forEach(c => {
              if (c.PatientId !== +results.params) {
                return;
              }
              this.patientCases.push({
                PatientName: c.PatientName,
                PatientId: c.PatientId,
                CaseId: c.CaseId,
                DateSubmitted: this.sharedService.getFormattedDate(
                  c.CaseStartDate
                ),
                EnrollmentStatus: c.EnrollmentStatus,
                Product: c.DrugGroup.Value,
                ActionNeeded: c.ActionNeeded ? 'Yes' : 'No',
              });
            });
            this.patientCasesDataSource.data = this.patientCases;
          });
          this.selectedCase = { key: 'CaseId', value: results.query['case'] };
          this.getCaseDetails(results.query['case']);
        },
      });
  }

  public getCaseDetails(caseId: string): void {
    this.enrolService.getCaseDetails(caseId).subscribe({
      next: resp => {
        if (resp && resp.Status === 'SUCCESS' && !resp.Payload.ErrorMessage) {
          this.caseDetail = resp.Payload;
          this.patientDemographics.caseDetails = {
            'Case Id': this.caseDetail.CaseInfo?.CaseId ?? '---',
            Gender: this.caseDetail.PatientDetails.Gender ?? '---',
            'Date of Birth':
              this.caseDetail.PatientDetails?.DateOfBirth ?? '---',
            'Enrollment Status': this.caseDetail.EnrollmentStatus ?? '---',
            Product: this.caseDetail.Product ?? '---',
            'Primary Insurance': this.getInsuranceName(
              this.caseDetail,
              'Primary'
            ),
            'Secondary Insurance': this.getInsuranceName(
              this.caseDetail,
              'Secondary'
            ),
          };

          this.patientDemographics.patientAddress = {
            'Address 1':
              this.caseDetail.PatientDetails?.Address?.Line1 ?? '---',
            'Address 2':
              this.caseDetail.PatientDetails?.Address?.Line2 ?? '---',
            City: this.caseDetail.PatientDetails?.Address?.City ?? '---',
            State: this.caseDetail.PatientDetails?.Address?.State ?? '---',
            Zip: this.caseDetail.PatientDetails?.Address?.PostalCode ?? '---',
          };
          const docs: any[] = [];
          this.caseDetail.Documents.forEach((doc: any) => {
            docs.push({
              DocumentType: doc.DocumentType,
              DocumentDate: this.sharedService.getFormattedDate(
                doc.DocumentDate
              ),
              DocumentURL: doc.DocumentURL,
            });
          });
          this.openDoc(docs[0]);
          this.docDataSource.data = docs;
          const alerts: any[] = [];
          this.caseDetail.Alerts.forEach((item: any) => {
            if (item.IsActive) {
              alerts.push({
                GeneratedDate: this.sharedService.getFormattedDate(
                  item.GenerateDate
                ),
                RequiredAction: item.Alert,
                Acknowledge: 'Acknowledge',
              });
            }
          });
          this.alertDataSource.data = alerts;
          this.sharedService.isLoading.next(false);
        } else {
          this.sharedService.notify('error', 'Error in fetching case details');
          this.sharedService.isLoading.next(false);
        }
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }

  public openDoc(docDetail: CaseDoc): void {
    this.enrolService.getCaseDoc(docDetail.DocumentURL).subscribe(pdf => {
      this.pdfSrc = window.URL.createObjectURL(pdf);
    });
  }

  public changeCases(patientCase: Case): void {
    this.router.navigate([`/enrollment/patients/${this.patientId}`], {
      queryParams: { case: patientCase.CaseId },
    });
  }

  private getInsuranceName(caseDetail: any, insuranceType: string): string {
    const planNames: string[] = [];
    if (caseDetail.MedicalInsuranceListInfo) {
      caseDetail.MedicalInsuranceListInfo.forEach((e: any) => {
        if (e.PlanRank === insuranceType) {
          planNames.push(e.PlanName);
        }
      });
    }
    if (caseDetail.PharmacyInsuranceInfoList) {
      caseDetail.PharmacyInsuranceInfoList.forEach((e: any) => {
        if (e.PlanRank === insuranceType) {
          planNames.push(e.PlanName);
        }
      });
    }
    return planNames ? planNames.join(';') : '---';
  }

  ngOnDestroy(): void {
    this.routeSubs.unsubscribe();
  }
}
