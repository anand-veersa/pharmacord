import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'select-insurance',
      form: {
        ...this.submitEnrolService.firstInsuranceForm.value,
        ...this.submitEnrolService.secondInsuranceForm.value,
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
}
