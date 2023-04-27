import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-attestation-details',
  templateUrl: './attestation-details.component.html',
  styleUrls: ['./attestation-details.component.scss'],
})
export class AttestationDetailsComponent implements OnInit {
  @Output() action = new EventEmitter();
  showPatientSignature: boolean = true;
  showConfirmationDialog: boolean = false;

  constructor(public submitEnrolService: SubmitEnrollmentService) {}

  ngOnInit() {
    this.submitEnrolService.createAttestationForm();
  }

  public clickedConsent(event: any): void {
    // console.log('event', event);

    if (event.field.name === 'prescriberSignatureOptions') {
      const arr = [
        'textingConsent',
        'patientAssistanceProgram',
        'patientSupportProgram',
        'hippaAuthorization',
        'patientSignatureOptions',
        'patientRepresentativeName',
        'relationshipToPatient',
        'patientEmail',
        'representativeEmail',
      ];
      this.submitEnrolService.attestationDetails.controls.forEach(field => {
        if (arr.includes(field.name)) {
          if (event.value === 'Download to print and sign')
            field.display = this.showPatientSignature = false;
          else field.display = this.showPatientSignature = true;
        }
      });
    }

    if (event.field.name === 'patientSignatureOptions') {
      this.submitEnrolService.attestationDetails.controls.forEach(field => {
        if (
          event.value ===
            'Authorized Representative will sign the enrollment form' ||
          event.value === 'Patient Representative will sign the enrollment form'
        ) {
          if (field.name === 'patientEmail') field.display = false;
          else field.display = true;
        } else if (event.value === 'Patient will sign the enrollment form') {
          if (
            field.name === 'patientRepresentativeName' ||
            field.name === 'relationshipToPatient' ||
            field.name === 'representativeEmail'
          )
            field.display = false;
          else field.display = true;
        }
      });
    }

    if (event.field.name === 'textingConsent') {
      this.showConfirmationDialog = true;
    }
  }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'attestation-details',
      form: this.submitEnrolService.attestationForm.value,
      nextScreen: actionType === 'back' ? 'select-insurance' : 'atte',
    });
  }
}
