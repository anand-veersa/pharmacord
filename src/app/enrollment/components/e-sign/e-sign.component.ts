import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';
import { EnrollmentService } from '../../enrollment.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-e-sign',
  templateUrl: './e-sign.component.html',
  styleUrls: ['./e-sign.component.scss'],
})
export class ESignComponent implements OnInit {
  @Output() action = new EventEmitter();
  public docuSignUrl: any = '';
  public pdfSrc: any = null;
  public eSignConfirmation: boolean = false;
  public showIframe: boolean = false;
  public showPDF: boolean = false;
  public thankYouScreen: boolean = false;
  public thankYouScreenDownloadable: boolean = false;
  private docId: string = '';
  private caseId: string = '';
  constructor(
    private submitEnrolService: SubmitEnrollmentService,
    private enrollService: EnrollmentService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // temp enroll call, Payload Data will come from submit-enroll-service
    // const tempPayload = {
    //   ExtRefId: '1683285590265',
    //   PopulatePdfFlag: true,
    //   DrugGroup: 'Jemperli',
    //   EnrollmentServiceRequests: [
    //     {
    //       Id: 1,
    //       Name: 'CoverageSupport',
    //     },
    //   ],
    //   PreferredSpecialityPharmacy: [
    //     {
    //       Name: 'No preference',
    //     },
    //   ],
    //   Patient: {
    //     FirstName: 'sdc',
    //     LastName: 'ujygh',
    //     DOB: '05032023',
    //     Gender: 'M',
    //     MMRStatus: ['dMMR'],
    //     DiagnosisCodes: ['MNE'],
    //     OtherDiagnosisCodes: null,
    //     OtherPriorTherapies: [''],
    //     Address1: 'ih',
    //     Address2: 'jkb',
    //     City: 'kjbn',
    //     State: 'CA',
    //     Zip: '87888',
    //     PatientEmailAddress: null,
    //     PatientId: null,
    //     Phones: [],
    //     AlternateContact: {
    //       FirstName: '',
    //       LastName: '',
    //       Phone: null,
    //     },
    //     PAInitiated: null,
    //     PAAppealInitiated: null,
    //     Allergies: '',
    //     PatientSpecialInstructions: '',
    //     DiagnosisDescriptions: [''],
    //     OtherDiagnosisDescription: '',
    //     PriorTherapies: ['TreatementWithPlatinum'],
    //     Last4SSN: '',
    //   },
    //   Financial: {
    //     HouseholdGrossAnnualIncome: '',
    //     NumberOfMembersInHousehold: '',
    //   },
    //   Insurance: {
    //     MedicalInsurance: 'N',
    //     PharmacyInsurance: 'N',
    //     MedicalPlans: [
    //       {
    //         Type: '',
    //         PlanRank: 'Primary',
    //         PolicyHolderEmployer: '',
    //       },
    //     ],
    //     PharmacyPlans: [],
    //   },
    //   PrescriptionInformation: {
    //     ShipToType: {},
    //     ProviderSignatureMapping: '',
    //     ShipToAddress: {
    //       RecipientName: 'jvh',
    //       Phone: '1234567890',
    //       Address1: 'uguh',
    //       Address2: null,
    //       City: 'gvh',
    //       State: 'AK',
    //       Zip: '33213',
    //     },
    //     Prescriptions: [
    //       {
    //         Quantity: null,
    //         Strength:
    //           'Injection: clear to slightly opalescent, colorless to yellow solution supplied in a carton containing one 500 mg/10 mL (50 mg/mL), single-dose vial (NDC 0173-0898-03). ',
    //         DirectionForAdministration: [
    //           'Dose 1 through 4: 500 mg every 3 weeks.',
    //           'Subsequent dosing beginning 3 weeks after Dose 4 (Dose5 onwards): 1000 mg every 6 weeks.',
    //           'Administer as an intravenous infusion over 30 minutes.',
    //         ],
    //       },
    //     ],
    //   },
    //   Clinical: {
    //     TherapyStartDate: '',
    //     Measurements: [],
    //     LastTreatmentDate: null,
    //   },
    //   Provider: {
    //     FirstName: 'ERIN',
    //     LastName: 'RIGGLE',
    //     NPI: '1003004771',
    //     Initials: '',
    //     Specialty: '',
    //     PTAN: '',
    //     Facility: {
    //       Id: 1000029438,
    //       NPI: '1234567890',
    //       Name: 'kedarnath',
    //       Address1: 'GauriKund',
    //       Address2: null,
    //       City: 'Kedar',
    //       State: 'AK',
    //       Zip: '11111',
    //       OfficeContactName: '',
    //     },
    //     Phones: [
    //       {
    //         Number: '1234567890',
    //         Ext: '',
    //       },
    //     ],
    //     Fax: '1234567890',
    //     Email: 'kedar@shiva.com',
    //     OtherFacilities: [
    //       {
    //         Name: 'ds',
    //         OfficeContactName: 'jvh',
    //         Phone: '1234567890',
    //         Address1: 'uguh',
    //         Address2: null,
    //         City: 'gvh',
    //         State: 'AK',
    //         Zip: '33213',
    //         FacilityType: 'Practice Office',
    //       },
    //     ],
    //   },
    //   Attestation: {
    //     IsPatientAttestationConsent: true,
    //     PrescriberDeclaration: 'true',
    //     TextingOptIn: true,
    //     PAPEnrollment: false,
    //     HIPPAAuthorization: true,
    //     PSPEnrollment: false,
    //     PatientEmail: 'dsd@gmail.com',
    //   },
    // };
    const tempPayload = this.submitEnrolService.enrollmentFormPayload;
    this.sharedService.isLoading.next(true);
    this.enrollService.enroll(tempPayload).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          this.docId = res.Payload.DocID;
          this.caseId = res.Payload.CaseId;
          this.enrollService.getDocument(this.docId).subscribe(pdf => {
            this.pdfSrc = window.URL.createObjectURL(pdf);
            this.showPDF = true;
          });
        }
        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });

    window.postMessage = msg => {
      if (msg === 'closeIframe') {
        setTimeout(() => {
          this.showIframe = false;
          // this.thankYouScreen = true;
          this.thankYouScreenDownloadable = true;
          this.cdr.detectChanges();
        }, 1000);
      }
    };
  }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'e-sign',
      form: {},
      nextScreen:
        actionType === 'back' ? 'attestation-details' : 'select-insurance',
    });
  }

  public eSignWork(): void {
    this.eSignConfirmation = true;
  }

  public continueToSigning(confirmation: boolean): void {
    if (confirmation) {
      // Esign signer call
      const SignerPayload = {
        CaseId: this.caseId,
        DocId: this.docId,
      };
      this.sharedService.isLoading.next(true);
      this.enrollService.postDocuSign(SignerPayload).subscribe({
        next: (res: any) => {
          this.docuSignUrl = res.Payload.docusignURL;
          if (this.docuSignUrl.length) {
            this.showIframe = true;
            this.showPDF = false;
          }
          this.sharedService.isLoading.next(false);
        },
        error: err => {
          this.sharedService.isLoading.next(false);
          this.sharedService.notify('error', err);
        },
      });
    }
    this.eSignConfirmation = false;
  }

  public downloadPdf(): void {
    this.sharedService.isLoading.next(true);
    this.enrollService.getPatientReferralPdf(this.docId).subscribe(
      (res: any) => {
        if (res) {
          // const response: any = res;

          // const blob = new Blob([res], { type: 'application/pdf' });

          const downloadURL = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download =
            'Patient-Referral' +
            '-' +
            this.submitEnrolService.enrollmentFormPayload.DrugGroup +
            '.pdf';
          link.click();
          this.sharedService.isLoading.next(false);
        } else {
          this.sharedService.isLoading.next(false);
          alert('Error in getting PDF');
        }
      },
      (err: any) => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      }
    );
  }

  public redirect() {
    this.docuSignUrl =
      'http://localhost:4200/#/onredirectionfromdocusign?event=signing_complete';
  }
}
