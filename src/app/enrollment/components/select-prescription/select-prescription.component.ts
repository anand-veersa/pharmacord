import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-prescription',
  templateUrl: './select-prescription.component.html',
  styleUrls: ['./select-prescription.component.scss'],
})
export class SelectPrescriptionComponent implements OnInit {
  @Output() title = new EventEmitter();
  @Output() action = new EventEmitter();

  constructor(public submitEnrolService: SubmitEnrollmentService) {}

  ngOnInit(): void {
    this.submitEnrolService.createPrescriptionForm();
  }

  onCheckboxClick(ev: any) {
    console.log('checkbox click', ev);
    this.submitEnrolService.prescriptionInfoDetails.controls.forEach(
      (control: JsonFormControls) => {
        if (control.name === `${ev.field.name}Pres`) {
          if (ev.isChecked) {
            control.display = true;
          } else {
            control.display = false;
          }
        }
      }
    );
  }

  onRadioClick(ev: any) {
    console.log(ev);
    this.submitEnrolService.clinicalInfoDetails.controls.forEach(
      (control: JsonFormControls) => {
        if (control.name === 'otherICD10Code') {
          if (ev === 'Other') {
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
      formName: 'select-prescription',
      form: {
        ...this.submitEnrolService.clinicalInfoForm.value,
        ...this.submitEnrolService.currentLineOfTherapyForm.value,
        ...this.submitEnrolService.prescriptionInfoForm.value,
      },
      nextScreen:
        actionType === 'back' ? 'select-medication' : 'attestation-details',
    });
  }
}
