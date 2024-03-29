import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/constants/app.constants';
import { SubmitEnrollmentService } from 'src/app/enrollment/pages/submit-enrollment/submit-enrollment.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-custom-prescription',
  templateUrl: './custom-prescription.component.html',
  styleUrls: ['./custom-prescription.component.scss'],
})
export class CustomPrescriptionComponent implements OnInit {
  @Input() field: any;
  @Input() form: FormGroup;
  @Input() formType: string = '';
  constructor(
    private submitEnrolService: SubmitEnrollmentService,
    public appConstants: AppConstants,
    public sharedService: SharedService
  ) {}

  medicineName = '';

  jemperliStrength = `Injection: clear to slightly opalescent, colorless to yellow solution
  supplied in a carton containing one 500 mg/10 mL (50 mg/mL),
  single-dose vial (NDC 0173-0898-03).`;

  jemperliDoa = [
    'Dose 1 through 4: 500 mg every 3 weeks.',
    'Subsequent dosing beginning 3 weeks after Dose 4 (Dose 5 onwards): 1000 mg every 6 weeks.',
    'Administer as an intravenous infusion over 30 minutes.',
  ];

  zejulaStrength = '100 mg capsules';

  ojjaaraDoa = 'Take 1 tablet orally once daily with or without food';

  ojjaaraRadio = {
    name: 'strength',
    placeholder: '',
    value: '',
    display: true,
    label: 'Strength/Form',
    type: 'radio',
    validators: { required: true },
    class: 'ojjaara-pres',
    options: [
      {
        label: '100 mg Tablet',
        value: '100 mg',
      },
      {
        label: '150 mg Tablet',
        value: '150 mg',
      },
      {
        label: '200 mg Tablet',
        value: '200 mg',
      },
    ],
  };

  isQtyRequired: boolean;
  isRefillsRequired: boolean;

  isStrengthRequired: boolean;
  isDoaRequired: boolean;

  ngOnInit(): void {
    this.medicineName =
      this.submitEnrolService.enrollmentFormPayload.DrugGroup.toUpperCase();
    this.isQtyRequired = this.form
      .get(this.field.name + '.qty')
      ?.hasValidator(Validators.required)
      ? true
      : false;
    this.isRefillsRequired = this.form
      .get(this.field.name + '.refills')
      ?.hasValidator(Validators.required)
      ? true
      : false;

    this.isStrengthRequired =
      this.medicineName === this.appConstants.MEDICINES.MEDICINE_3;
    this.isDoaRequired =
      this.medicineName === this.appConstants.MEDICINES.MEDICINE_2;

    if (this.medicineName === this.appConstants.MEDICINES.MEDICINE_1) {
      this.form
        .get(`${this.field.name}.strength`)
        ?.patchValue(this.jemperliStrength);
      this.form.get(`${this.field.name}.doa`)?.patchValue(this.jemperliDoa);
    } else if (this.medicineName === this.appConstants.MEDICINES.MEDICINE_2) {
      this.form.get(`${this.field.name}.strength`)?.patchValue('100 mg');
    } else if (this.medicineName === this.appConstants.MEDICINES.MEDICINE_3) {
      this.form.get(`${this.field.name}.doa`)?.patchValue(this.ojjaaraDoa);
    }
  }
}
