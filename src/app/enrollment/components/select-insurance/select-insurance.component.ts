import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-insurance',
  templateUrl: './select-insurance.component.html',
  styleUrls: ['./select-insurance.component.scss'],
})
export class SelectInsuranceComponent implements OnInit {
  @Output() title = new EventEmitter();
  @Output() action = new EventEmitter();
  public firstInsurance: boolean = false;
  public firstInsuranceFiles: any[] = [];
  public secondInsurance: boolean = false;

  constructor(public submitEnrolService: SubmitEnrollmentService) {}

  ngOnInit(): void {
    this.submitEnrolService.createInsuranceForm();
  }

  public showPaStatus1(res: any): void {
    const value = res.value;
    this.submitEnrolService.priorAuthDetails.controls.forEach(
      (control: JsonFormControls) => {
        if (control.name === 'paStatus1') {
          if (value === 'Yes') {
            control.display = true;
          } else {
            control.display = false;
          }
        }
      }
    );
  }

  public showPaStatus2(res: any): void {
    const value = res.value;
    this.submitEnrolService.appealDetails.controls.forEach(
      (control: JsonFormControls) => {
        if (control.name === 'paStatus2') {
          if (value === 'Yes') {
            control.display = true;
          } else {
            control.display = false;
          }
        }
      }
    );
  }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'select-insurance',
      form: {
        firstInsuranceForm: {
          ...this.submitEnrolService.firstInsuranceForm.value,
        },
        secondInsuranceForm: {
          ...this.submitEnrolService.secondInsuranceForm.value,
        },
        priorAuthForm: { ...this.submitEnrolService.priorAuthForm.value },
        appealForm: { ...this.submitEnrolService.appealForm.value },
      },
      nextScreen:
        actionType === 'back' ? 'prescriber-details' : 'select-prescription',
    });
  }

  public removeAttachFile(insuranceType: string, index: number): void {
    if (insuranceType === 'first') {
      const currentValue =
        this.submitEnrolService.firstInsuranceForm.controls[
          'firstInsuranceFiles'
        ].value;
      currentValue.splice(index, 1);
      this.submitEnrolService.firstInsuranceForm
        .get('firstInsuranceFiles')
        ?.setValue(currentValue);
    } else {
      const currentValue =
        this.submitEnrolService.secondInsuranceForm.controls[
          'secondInsuranceFiles'
        ].value;
      currentValue.splice(index, 1);
      this.submitEnrolService.secondInsuranceForm
        .get('secondInsuranceFiles')
        ?.setValue(currentValue);
    }
  }

  public isNextDisabled(): boolean {
    let isFormValid = true;

    if (this.firstInsurance) {
      isFormValid =
        isFormValid && this.submitEnrolService.firstInsuranceForm.valid;
    }
    if (this.secondInsurance) {
      isFormValid =
        isFormValid && this.submitEnrolService.secondInsuranceForm.valid;
    }
    if (this.firstInsurance || this.secondInsurance) {
      if (
        this.submitEnrolService.priorAuthForm.get('priorAuth1')?.value === 'Yes'
      ) {
        isFormValid =
          isFormValid && this.submitEnrolService.priorAuthForm.valid;
      }
      if (
        this.submitEnrolService.appealForm.get('priorAuth2')?.value === 'Yes'
      ) {
        isFormValid = isFormValid && this.submitEnrolService.appealForm.valid;
      }
    }

    return !isFormValid;
  }
}
