import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubmitEnrollmentService } from 'src/app/enrollment/pages/submit-enrollment/submit-enrollment.service';
import { JsonFormControls } from 'src/app/models/json-form-data.model';

@Component({
  selector: 'app-custom-prescription',
  templateUrl: './custom-prescription.component.html',
  styleUrls: ['./custom-prescription.component.scss'],
})
export class CustomPrescriptionComponent {
  @Input() field: JsonFormControls;
  @Input() form: FormGroup;
  @Input() formType: string = '';
  constructor(private submitEnrolService: SubmitEnrollmentService) {}

  radio = {
    name: 'strength',
    placeholder: '',
    value: '',
    display: true,
    label: 'Strength/Form',
    type: 'radio',
    validators: { required: true },
    class: 'ssss',
    options: [
      {
        label: '100 mg Tablet',
        value: '100 mg Tablet',
      },
      {
        label: '150 mg Tablet',
        value: '150 mg Tablet',
      },
      {
        label: '200 mg Tablet',
        value: '200 mg Tablet',
      },
    ],
    for: 'Zejula',
  };
  medicineName = '';

  quantity: undefined | number;
  refills: undefined | number;
  strength: undefined | string;

  isQtyDisabled: boolean;
  isRefillsDisabled: boolean;
  isQtyRequired: boolean;
  isRefillsRequired: boolean;

  isStrengthRequired: boolean;
  isDoaRequired: boolean;

  ngOnChanges() {
    this.medicineName = this.submitEnrolService.enrollmentFormPayload.DrugGroup;
    this.quantity = this.field.qty;
    this.refills = this.field.refills;

    this.isQtyDisabled = this.field.refills ? true : false;
    this.isRefillsDisabled = this.field.refills ? true : false;

    this.isQtyRequired = this.field.refills ? false : true;
    this.isRefillsRequired = this.field.refills ? false : true;

    this.isStrengthRequired = this.medicineName === 'Ojjaara';
    this.isDoaRequired = this.medicineName === 'Zejula';

    console.log('custom pres', this.form);
  }

  doa = 'Take 1 tablet orally once daily with or without food';
}
