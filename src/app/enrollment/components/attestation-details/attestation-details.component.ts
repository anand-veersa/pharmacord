import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';
import { AppConstants } from 'src/app/constants/app.constants';
import { MatCheckbox } from '@angular/material/checkbox';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-attestation-details',
  templateUrl: './attestation-details.component.html',
  styleUrls: ['./attestation-details.component.scss'],
})
export class AttestationDetailsComponent implements OnInit {
  @Output() action = new EventEmitter();
  public showPatientSignature: boolean = true;
  public showConfirmationDialog: boolean = false;
  public dialogTitle: string = '';
  public dialogDescription: string = '';
  private rowClicked: {
    checkboxRef: MatCheckbox;
    isChecked: true;
    field: JsonFormControls;
  };

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private appConstants: AppConstants
  ) {}

  ngOnInit() {
    this.submitEnrolService.createAttestationForm();
  }

  public clickedConsent(event: any): void {
    this.rowClicked = event;
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

    switch (event.field.name) {
      case 'prescriberDeclaration':
        if (event.isChecked) this.showConfirmationDialog = true;
        this.dialogTitle = 'Prescriber Declaration';
        this.dialogDescription = this.appConstants.prescriberDeclation;
        break;
      case 'textingConsent':
        if (event.isChecked) this.showConfirmationDialog = true;
        this.dialogTitle = 'Texting Consent (Rates May Apply)';
        this.dialogDescription = this.appConstants.textingConsent;
        break;
      case 'patientAssistanceProgram':
        if (event.isChecked) this.showConfirmationDialog = true;
        this.dialogTitle =
          'Patient Assistance Program (PAP) for uninsured and eligible Medicare patients';
        this.dialogDescription = this.appConstants.papConsent;
        break;
      case 'patientSupportProgram':
        if (event.isChecked) this.showConfirmationDialog = true;
        this.dialogTitle = 'Patient Support Program (Optional)';
        this.dialogDescription = this.appConstants.pspConsent;
        break;
      case 'hippaAuthorization': {
        if (event.isChecked) this.showConfirmationDialog = true;
        this.dialogTitle = 'HIPAA Patient Authorization';
        const drugGroup =
          this.submitEnrolService?.enrollmentFormPayload.DrugGroup;
        if (drugGroup === 'Jemperli')
          this.dialogDescription = this.appConstants.hippaConsentJemperli;
        else if (drugGroup === 'Zejula')
          this.dialogDescription = this.appConstants.hippaConsentZejula;
        else this.dialogDescription = this.appConstants.hippaConsentOjjaara;
        break;
      }
      default:
        break;
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

  public confirmConsent(confirmation: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmation) {
      this.rowClicked.field.value = true;
      this.rowClicked.checkboxRef.checked = true;
    } else {
      this.rowClicked.checkboxRef.checked = false;
      this.rowClicked.field.value = false;
    }
  }
}
