import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Subscription } from 'rxjs';
import { Case } from 'src/app/models/cases.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { EnrollmentService } from '../../enrollment.service';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  private routeSubs: Subscription;
  public patientCases = new MatTableDataSource<Case>([]);
  public caseDetail: any;
  public shippingData: any[];
  public caseDocuments: any[];
  public alerts: any[];
  public displayedColumns: string[] = [];
  public columnSchema: any[] = [];
  public pageSizeOptions: number[] = [10, 20, 50];

  constructor(
    private route: ActivatedRoute,
    private enrolService: EnrollmentService,
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.http.get('/assets/json/cases-table.json').subscribe((data: any) => {
      this.columnSchema = data.columns;
      data.columns.map((column: any) => {
        this.displayedColumns.push(column.key);
      });
    });
  }

  ngOnInit(): void {
    this.routeSubs = combineLatest([this.route.params, this.route.queryParams])
      .pipe(map(results => ({ params: results[0]['id'], query: results[1] })))
      .subscribe(results => {
        this.sharedService.isLoading.next(true);
        this.enrolService.cases.subscribe((cases: any[]) => {
          const patientCases = cases.filter(c => {
            if (c.PatientId !== +results.params) {
              return;
            }
            return {
              CaseId: c.CaseId,
              DateSubmitted: c.DateSubmitted,
              EnrollmentStatus: c.EnrollmentStatus,
              Product: c.Product,
              ActionNeeded: c.ActionNeeded,
            };
          });
          this.patientCases.data = patientCases;
        });
        this.enrolService.getCaseDetails(results.query['case']).subscribe({
          next: resp => {
            if (
              resp &&
              resp.Status === 'SUCCESS' &&
              !resp.Payload.ErrorMessage
            ) {
              this.caseDetail = resp.Payload;
              this.shippingData = this.caseDetail.ShipmentInfo.Shipments;
              this.caseDocuments = resp.Payload.Documents;
              this.alerts = this.caseDetail.Alerts.filter(
                (item: any) => item.IsActive
              );
            } else {
              this.sharedService.notify(
                'error',
                'Error in fetching case details'
              );
            }
            this.sharedService.isLoading.next(false);
          },
          error: err => {
            this.sharedService.isLoading.next(false);
            this.sharedService.notify('error', err);
          },
        });
      });
  }

  ngOnDestroy(): void {
    this.routeSubs.unsubscribe();
  }
}
