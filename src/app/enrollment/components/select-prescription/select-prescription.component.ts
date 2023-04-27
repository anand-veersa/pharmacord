import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  public onAction(actionType: string): void {
    console.log('hey', actionType);
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
