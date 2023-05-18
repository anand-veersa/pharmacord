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
  public almostDoneDownloadable: boolean = false;
  private docId: string = '';
  private caseId: string = '';
  constructor(
    private submitEnrolService: SubmitEnrollmentService,
    private enrollService: EnrollmentService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sharedService.isLoading.next(true);
    this.enrollService
      .enroll(this.submitEnrolService.enrollmentFormPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            this.docId = res.Payload.DocID;
            this.caseId = res.Payload.CaseId;
            if (
              this.submitEnrolService.attestationForm.controls[
                'prescriberSignatureOptions'
              ].value === 'Download to print and sign'
            ) {
              this.almostDoneDownloadable = true;
            } else {
              this.enrollService.getDocument(this.docId).subscribe(pdf => {
                this.pdfSrc = window.URL.createObjectURL(pdf);
                this.showPDF = true;
              });
            }
          }
          this.sharedService.isLoading.next(false);
        },
        error: err => {
          this.onAction('back');
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
