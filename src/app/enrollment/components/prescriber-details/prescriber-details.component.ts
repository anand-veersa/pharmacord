import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-prescriber-details',
  templateUrl: './prescriber-details.component.html',
  styleUrls: ['./prescriber-details.component.scss'],
})
export class PrescriberDetailsComponent implements OnInit {
  @Output() action = new EventEmitter();

  constructor(public submitEnrolService: SubmitEnrollmentService) {}

  ngOnInit(): void {
    if (!this.submitEnrolService.prescriberDetailForm)
      this.submitEnrolService.createPrescriberForm();
  }

  public checkFormValidity(): boolean {
    return (
      this.submitEnrolService.prescriberDetailForm.invalid ||
      this.submitEnrolService.shippingDetailForm.invalid
    );
  }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'prescriber-details',
      form: {
        ...this.submitEnrolService.prescriberDetailForm.value,
        ...this.submitEnrolService.shippingDetailForm.value,
      },
      nextScreen: actionType === 'back' ? 'select-patient' : 'select-insurance',
    });
  }
}
