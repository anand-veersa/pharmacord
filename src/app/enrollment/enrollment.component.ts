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
    this.sharedService.isLoading.next(true);
    this.enrolService
      .getAccountInfo(
        JSON.parse(this.localStorage.getItem('userData')).UserName
      )
      .subscribe({
        next: (res: any) => {
          this.enrolService
            .getProviderCases(
              this.authService.user.providers[0].ProviderId,
              this.authService.user.portalAccountPkId
            )
            .subscribe({
              next: response => {
                this.enrolService.cases.next(response.Payload);
                this.cases = response.Payload;
                const medicineCases = this.cases.filter(
                  c =>
                    c.DrugGroup.Value.toLowerCase() ===
                    this.selectedMed.toLowerCase()
                );
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

  public changeMedicine(medicine: string): void {
    //TODO REMOVE ONCE TESTED
    this.cases = [
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3814',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-20T07:52:29.448',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'China',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Zejula',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3824',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-21T14:25:34.346',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'China',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Zejula',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: true,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK4039',
        CaseType: 'Case Management',
        CaseStartDate: '2023-02-02T10:31:03.54',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'China',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Ojjaara',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: true,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK4040',
        CaseType: 'Case Management',
        CaseStartDate: '2023-02-02T10:31:55.552',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'China',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Ojjaara',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027182,
        PatientName: 'xft ugg',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK4299',
        CaseType: 'Case Management',
        CaseStartDate: '2023-02-21T02:52:15.145',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'xft   ugg',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3794',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-11T08:32:46.725',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3819',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-20T13:13:04.048',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'China',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3835',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-24T08:08:42.62',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3836',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-24T08:09:05.833',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3837',
        CaseType: 'Case Management',
        CaseStartDate: '2023-01-24T08:09:36.403',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027168,
        PatientName: 'Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2002-12-01',
        Gender: 'M',
        GenderIdentity: null,
        CaseId: 'GSK3590',
        CaseType: 'Case Management',
        CaseStartDate: '2022-12-01T02:05:55.117',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Coverage   Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027177,
        PatientName: 'Patient Assistance Program',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'M',
        GenderIdentity: null,
        CaseId: 'GSK3594',
        CaseType: 'Case Management',
        CaseStartDate: '2022-12-01T08:51:53.861',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Patient Assistance   Program',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: true,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027178,
        PatientName: 'Alternate Coverage Support',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3595',
        CaseType: 'Case Management',
        CaseStartDate: '2022-12-01T09:05:41.551',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Alternate   Coverage Support',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: true,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027181,
        PatientName: 'Commercial Co pay assistance',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3597',
        CaseType: 'Case Management',
        CaseStartDate: '2022-12-01T09:21:23.193',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'Commercial   Co pay assistance',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: true,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027182,
        PatientName: 'xft ugg',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3598',
        CaseType: 'Case Management',
        CaseStartDate: '2022-12-01T09:49:58.621',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'xft   ugg',
        DrugGroup: {
          Id: 2,
          Value: 'Jemperli',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
      {
        'prescriberId ': '3393',
        PatientId: 1000027182,
        PatientName: 'xft ugg',
        PatientMiddleName: ' ',
        DateOfBirth: '2022-12-01',
        Gender: 'F',
        GenderIdentity: null,
        CaseId: 'GSK3599',
        CaseType: 'Case Management',
        CaseStartDate: '2022-12-01T09:57:39.117',
        CaseStatus: 'Open',
        CaseStatusReason: 'In Process-Intake In Process',
        PapOutcome: null,
        PapOutcomeDate: null,
        ActiveStages: ['Intake'],
        PracticeName: 'Mumbai',
        TherapyJourneys: [],
        PatientFullName: 'xft   ugg',
        DrugGroup: {
          Id: 2,
          Value: 'Zejula',
          IsActive: true,
        },
        CollaboratingProvider: null,
        ActionNeeded: false,
        EnrollmentStatus: 'Intake',
      },
    ];
    this.selectedMed = medicine;
    this.enrolService.selectedMedicine.next(medicine);
    if (medicine === this.appConstants.MEDICINES.ALL) return;
    const medicineCases = this.cases.filter(
      c => c.DrugGroup.Value.toLowerCase() === medicine.toLowerCase()
    );
    this.enrolService.medicineCases.next(medicineCases);
  }
}
