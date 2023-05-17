import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';
// import { JsonFormControls } from 'src/app/models/json-form-data.model';

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

  public onShippingTypeChange(event: any): void {
    let addressDetails = {
      street: null,
      city: null,
      state: '',
      zipcode: null,
    };
    if (event.value === 'patientAddress') {
      const patientDetails = this.submitEnrolService.patientDetailForm?.value;
      addressDetails = {
        street: patientDetails?.patientAddress1,
        city: patientDetails?.city,
        state: patientDetails?.state,
        zipcode: patientDetails?.zipcode,
      };
    }
    this.submitEnrolService.shippingDetailForm.patchValue(addressDetails);

    Object.entries(addressDetails).forEach(([key, value]) => {
      const formField = this.submitEnrolService.shippingDetailForm.get(key);
      if (!value) {
        formField?.enable();
      } else {
        formField?.disable();
      }
    });

    // this.submitEnrolService.shippingDetails.controls.forEach(
    //   (control: JsonFormControls) => {
    //     if (control.name in addressDetails) {
    //       control.display = true;
    //       let value = addressDetails[control.name as keyof typeof addressDetails];
    //       console.log('value',value)
    //       console.log(addressDetails)
    //       control.value = value;
    //       control.disabled = value ? true : false;
    //     }
    //   }
    // );
  }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'prescriber-details',
      form: {
        prescriberDetailForm: {
          ...this.submitEnrolService.prescriberDetailForm.value,
        },
        shippingDetailForm: {
          ...this.submitEnrolService.shippingDetailForm.value,
        },
      },
      nextScreen: actionType === 'back' ? 'select-patient' : 'select-insurance',
    });
  }
}
