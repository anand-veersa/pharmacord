import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';
import { AppConstants } from 'src/app/constants/app.constants';
import { MatCheckbox } from '@angular/material/checkbox';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, Validators } from '@angular/forms';

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
  private attestationConsentClicked: boolean = false;

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private appConstants: AppConstants,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.user?.role?.RolePkId === 4) {
      this.showPatientSignature = false;
    }
    this.submitEnrolService.createAttestationForm(() => {
      this.setPrescriberSignatureOptions();
      this.setPatientSignatureOptions();
    });
  }

  public clickedConsent(event: any): void {
    this.rowClicked = event;
    if (event.field.name === 'prescriberSignatureOptions') {
      this.setPrescriberSignatureOptions();
    }

    if (event.field.name === 'patientSignatureOptions')
      this.setPatientSignatureOptions();

    switch (event.field.name) {
      case 'attestationConsent':
        this.showConfirmationDialog = false;
        this.attestationConsentClicked = !this.attestationConsentClicked;
        this.confirmConsent(this.attestationConsentClicked);
        break;
      case 'prescriberDeclaration':
        this.showConfirmationDialog = true;
        this.dialogTitle = 'Prescriber Declaration';
        this.dialogDescription = this.appConstants.PRESCRIBER_DECLARATION;
        break;
      case 'textingConsent':
        this.showConfirmationDialog = true;
        this.dialogTitle = 'Texting Consent (Rates May Apply)';
        this.dialogDescription = this.appConstants.TEXTING_CONSENT;
        break;
      case 'patientAssistanceProgram':
        this.showConfirmationDialog = true;
        this.dialogTitle =
          'Patient Assistance Program (PAP) for uninsured and eligible Medicare patients';
        this.dialogDescription = this.appConstants.PAP_CONSENT;
        break;
      case 'patientSupportProgram':
        this.showConfirmationDialog = true;
        this.dialogTitle = 'Patient Support Program (Optional)';
        this.dialogDescription = this.appConstants.PSP_CONSENT;
        break;
      case 'hippaAuthorization': {
        this.showConfirmationDialog = true;
        this.dialogTitle = 'HIPAA Patient Authorization';
        const drugGroup =
          this.submitEnrolService?.enrollmentFormPayload.DrugGroup;
        if (drugGroup === 'Jemperli')
          this.dialogDescription = this.appConstants.HIPPA_CONSENT_JEMPERLI;
        else if (drugGroup === 'Zejula')
          this.dialogDescription = this.appConstants.HIPPA_CONSENT_ZEJULA;
        else this.dialogDescription = this.appConstants.HIPPA_CONSENT_OJJAARA;
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
      nextScreen: actionType === 'back' ? 'select-prescription' : 'e-sign',
    });
  }

  public confirmConsent(confirmation: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmation) {
      this.submitEnrolService.attestationForm
        ?.get(this.rowClicked.field.name)
        ?.setValue(true);
      this.rowClicked.checkboxRef.checked = true;
    } else {
      this.rowClicked.checkboxRef.checked = false;
      this.submitEnrolService.attestationForm
        ?.get(this.rowClicked.field.name)
        ?.setValue(false);
    }
  }

  private updateValidation(form: FormGroup, field: any, show: boolean) {
    const reqFields = [
      'patientRepresentativeName',
      'relationshipToPatient',
      'representativeEmail',
      'patientEmail',
    ];
    const reqTrueFields = [
      'hippaAuthorization',
      'attestationConsent',
      'prescriberDeclaration',
    ];
    const emailFields = ['patientEmail', 'representativeEmail'];

    const formField = form.get(field.name);

    if (!show) {
      formField?.clearValidators();
    } else {
      if (reqFields.includes(field.name)) {
        formField?.addValidators(Validators.required);
      }
      if (reqTrueFields.includes(field.name)) {
        formField?.addValidators(Validators.requiredTrue);
      }
      if (emailFields.includes(field.name)) {
        formField?.addValidators(Validators.email);
      }
    }
    formField?.updateValueAndValidity();
  }

  private setPrescriberSignatureOptions() {
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

    const prescriberSignatureOptions =
      this.submitEnrolService.attestationForm?.get(
        'prescriberSignatureOptions'
      )?.value;

    this.submitEnrolService.attestationDetails.controls.forEach(field => {
      if (arr.includes(field.name)) {
        if (prescriberSignatureOptions === 'Download to print and sign') {
          field.display = this.showPatientSignature = false;
          this.updateValidation(
            this.submitEnrolService.attestationForm,
            field,
            false
          );
        } else {
          field.display = this.showPatientSignature = true;
          this.updateValidation(
            this.submitEnrolService.attestationForm,
            field,
            true
          );
          this.setPatientSignatureOptions();
        }
      }
    });
  }

  private setPatientSignatureOptions() {
    const patientSignatureOptions =
      this.submitEnrolService.attestationForm?.get(
        'patientSignatureOptions'
      )?.value;
    this.submitEnrolService.attestationDetails.controls.forEach(field => {
      if (
        patientSignatureOptions ===
          'Authorized Representative will sign the enrollment form' ||
        patientSignatureOptions ===
          'Patient Representative will sign the enrollment form'
      ) {
        if (field.name === 'patientEmail') {
          field.display = false;
          this.updateValidation(
            this.submitEnrolService.attestationForm,
            field,
            false
          );
        } else {
          field.display = true;
          this.updateValidation(
            this.submitEnrolService.attestationForm,
            field,
            true
          );
        }
      } else if (
        patientSignatureOptions === 'Patient will sign the enrollment form'
      ) {
        if (
          field.name === 'patientRepresentativeName' ||
          field.name === 'relationshipToPatient' ||
          field.name === 'representativeEmail'
        ) {
          field.display = false;
          this.updateValidation(
            this.submitEnrolService.attestationForm,
            field,
            false
          );
        } else {
          field.display = true;
          this.updateValidation(
            this.submitEnrolService.attestationForm,
            field,
            true
          );
        }
      }
    });
  }
}
