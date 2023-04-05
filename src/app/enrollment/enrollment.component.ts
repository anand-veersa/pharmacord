import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppConstants } from '../constants/app.constants';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { SharedService } from '../shared/services/shared.service';
import { EnrollmentService } from './enrollment.service';
@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
})
export class EnrollmentComponent implements OnInit {
  public currentDate = new Date();
  public selectedMed: string;
  public medicineCases: any[] = [];
  public cases: any[] = [];
  public enableAllMeds: boolean = false;
  public enrollCreationActive: boolean = false;

  constructor(
    private enrolService: EnrollmentService,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    public appConstants: AppConstants
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/create')) {
          this.enrolService.submitFormInitiated.next(true);
        }
        if (
          event.url.includes('/patients') ||
          event.url.includes('/tools-and-forms')
        ) {
          this.enableAllMeds = true;
          this.selectedMed = this.appConstants.MEDICINES.ALL;
          this.enrolService.selectedMedicine.next(
            this.appConstants.MEDICINES.ALL
          );
        } else {
          this.enableAllMeds = false;
          this.changeMedicine(this.appConstants.MEDICINES.MEDICINE_1);
        }
      }
    });
  }

  ngOnInit(): void {
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
                      c.DrugGroup.Value.toLowerCase() ===
                      this.selectedMed.toLowerCase()
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
}
