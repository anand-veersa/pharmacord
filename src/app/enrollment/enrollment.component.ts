import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppConstants } from '../constants/app.constants';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { SharedService } from '../shared/services/shared.service';
import { EnrollmentService } from './enrollment.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomUploadDocumentsComponent } from '../shared/components/custom-upload-documents/custom-upload-documents.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
})
export class EnrollmentComponent implements OnInit, OnDestroy {
  public currentDate = new Date();
  public selectedMed: string;
  public medicineCases: any[] = [];
  public cases: any[] = [];
  public enableAllMeds: boolean = false;
  public enrollCreationActive: boolean = false;
  public screenWidth: number;
  public hideEnrollmentBtns: boolean = false;
  private routeSubs: Subscription;
  private dialogRef: MatDialogRef<CustomUploadDocumentsComponent>;
  private patientId: string = '';
  private caseId: string = '';
  private progressData: any[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public appConstants: AppConstants,
    public dialog: MatDialog,
    private enrolService: EnrollmentService,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/create')) {
          this.hideEnrollmentBtns = false;
          this.enrolService.submitFormInitiated.next(true);
        }
        if (event.url.match(/\/patients\/[0-9]/g)?.length) {
          this.hideEnrollmentBtns = true;
        } else if (
          event.url.includes('/dashboard') ||
          event.url.includes('/patients') ||
          event.url.includes('/tools-and-forms')
        ) {
          this.enableAllMeds = true;
          this.selectedMed = this.appConstants.MEDICINES.ALL;
          this.enrolService.selectedMedicine.next(
            this.appConstants.MEDICINES.ALL
          );
          this.hideEnrollmentBtns = false;
        } else {
          this.enableAllMeds = false;
          this.hideEnrollmentBtns = false;
          this.changeMedicine(this.appConstants.MEDICINES.MEDICINE_1);
        }
      }
    });
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.enrolService.submitFormInitiated.subscribe(
      state => (this.enrollCreationActive = state)
    );
    this.sharedService.isLoading.next(true);
    this.enrolService
      .getAccountInfo(
        JSON.parse(this.localStorage.getItem('userData')).UserName
      )
      .subscribe({
        next: (res: any) => {
          this.enrolService
            .getPrescriberCases(
              this.authService.user.prescribers[0].ProviderId,
              this.authService.user.portalAccountPkId
            )
            .subscribe({
              next: response => {
                if (Object.keys(response.Payload).length === 0) {
                  this.sharedService.notify('error', 'No data found');
                  this.sharedService.isLoading.next(false);
                  return;
                }
                this.enrolService.cases.next(response.Payload);
                this.cases = response.Payload;
                let medicineCases: any[] = [];
                if (this.selectedMed === this.appConstants.MEDICINES.ALL) {
                  medicineCases = this.cases;
                } else {
                  medicineCases = this.cases.filter(
                    c =>
                      c.DrugGroup.Value?.toLowerCase() ===
                      this.selectedMed?.toLowerCase()
                  );
                }
                this.enrolService.medicineCases.next(medicineCases);
                this.sharedService.isLoading.next(false);
              },
              error: err => {
                this.sharedService.notify('error', err, '');
                this.sharedService.isLoading.next(false);
              },
            });
        },
        error: err => {
          this.sharedService.notify('error', err, '');
          this.sharedService.isLoading.next(false);
        },
      });
  }

  public startEnrollment(): void {
    this.router.navigate(['/enrollment/create']);
  }

  public changeMedicine(medicine: string): void {
    if (!this.cases) return;
    this.selectedMed = medicine;
    let medicineCases = [];
    this.enrolService.selectedMedicine.next(medicine);
    if (medicine === this.appConstants.MEDICINES.ALL)
      medicineCases = this.cases;
    else {
      medicineCases = this.cases.filter(
        c => c.DrugGroup.Value.toLowerCase() === medicine.toLowerCase()
      );
    }
    this.enrolService.medicineCases.next(medicineCases);
  }

  public openDialog(): void {
    this.route.children[0].params.subscribe(param => {
      this.patientId = param['id'];
    });

    let patientName = '';
    this.enrolService.cases.subscribe(res => {
      patientName = res.find(p => p.PatientId === +this.patientId)?.PatientName;
    });

    this.route.children[0].queryParams.subscribe(queryParam => {
      this.caseId = queryParam['case'];
    });

    this.dialogRef = this.dialog.open(CustomUploadDocumentsComponent, {
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
      data: {
        patientName: patientName,
        caseId: this.caseId,
        progressData: this.progressData,
      },
    });
    this.dialogRef.componentInstance.attachedDocuments.subscribe(
      uploadedFiles => {
        this.handleUploadDocs(uploadedFiles);
      }
    );
    this.dialogRef.afterClosed().subscribe(() => (this.progressData = []));
  }

  public handleUploadDocs(documents: any[]): void {
    let count = 0;
    this.progressData = Array(documents.length).fill({ name: '', progress: 0 });
    documents.forEach((document: File, index: number) => {
      if (document.size > this.appConstants.MAX_FILE_SIZE) {
        this.sharedService.notify(
          'error',
          `${document.name}  Failed to upload`
        );
      } else {
        this.sharedService.isLoading.next(true);
        this.progressData[index] = {
          name: document.name,
          progress: 50,
        };

        this.setProgress();

        this.enrolService
          .uploadDocument(document, this.patientId, this.caseId)
          .subscribe({
            next: res => {
              this.sharedService.isLoading.next(true);
              if (res && res.Status === 'SUCCESS') {
                this.progressData[index].progress = 100;
                this.setProgress();
                this.sharedService.notify(
                  'success',
                  `${document.name} Uploaded successfully`
                );
                count++;
              } else {
                this.sharedService.notify(
                  'error',
                  `${document.name} Failed to upload `
                );
                count++;
              }
              if (count === documents.length) {
                this.sharedService.isLoading.next(false);
                this.enrolService.documentUploaded.next(true);
              }
            },
            error: err => {
              this.sharedService.notify('error', err);
            },
          });
      }
    });
  }

  private setProgress(): void {
    this.dialogRef.componentInstance.data.progressData = [...this.progressData];
  }

  ngOnDestroy(): void {
    this.routeSubs?.unsubscribe();
  }
}
