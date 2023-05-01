import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SubmitEnrollmentService } from 'src/app/enrollment/pages/submit-enrollment/submit-enrollment.service';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
// import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-prescription',
  templateUrl: './select-prescription.component.html',
  styleUrls: ['./select-prescription.component.scss'],
})
export class SelectPrescriptionComponent implements OnInit {
  @Output() title = new EventEmitter();
  @Output() action = new EventEmitter();

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    public fb: FormBuilder
  ) {}
  medicine = '';
  ngOnInit(): void {
    this.medicine = this.submitEnrolService.enrollmentFormPayload.DrugGroup;
  }
  onCheckChange(ev: any) {
    const form: FormGroup = ev.form;
    const formArrName: string = ev.formArrName;
    const event = ev.ev;

    const formArray: FormArray = form.get(formArrName) as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: AbstractControl<any, any>) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }
  clinicalInfoForm = this.fb.group({
    patientFirstName: ['', Validators.required],
    patientLastName: ['', Validators.required],
    patientDateOfBirth: ['', Validators.required],
    treatmentStartDate: [''],
    primaryDiagnosis: ['', Validators.required],
    primaryDiagnosisICD10Code: ['', Validators.required],
    diagnosisICD10Code: ['', Validators.required],
    otherICD10Code: ['', Validators.required],
    mismatchrepairstatusMMR: this.fb.array([]),
    endometrialCancerPriortherapies: this.fb.array([]),
    secondaryDiagnosis: [''],
    secondaryDiagnosisICD10Code: [''],
  });
  currentLineOfTherapyForm = this.fb.group({
    currentLineOfTherapy: ['', Validators.required],
    bRCATest: [''],
    hRDTest: [''],
    previousTherapies: [''],
    latestHemoglobin: [''],
    dateOfLastTransfusion: [''],
    knownDrugAllergies: [''],
    notes: [''],
  });
  prescriptionInfoForm = this.fb.group({
    zejStd: this.fb.array([]),
    zejStdPres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [undefined],
    }),
    zejQSP: this.fb.array([]),
    zejQSPPres: this.fb.group({
      strength: [],
      qty: [{ value: undefined, disabled: false }],
      refills: [{ value: undefined, disabled: false }],
      doa: [undefined],
    }),
    zejBridge: this.fb.array([]),
    zejBridgePres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [undefined],
    }),
    ojjaaraStd: this.fb.array([]),
    ojjaaraStdPres: this.fb.group({
      strength: [],
      qty: [{ value: undefined, disabled: false }],
      refills: [{ value: undefined, disabled: false }],
      doa: [undefined],
    }),
    ojjaaraQSP: this.fb.array([]),
    ojjaaraQSPPres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [undefined],
    }),
    ojjaaraBridge: this.fb.array([]),
    ojjaaraBridgePres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [undefined],
    }),
    jemperliIV: this.fb.array([]),
    jemperliIVPres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [undefined],
    }),
    prescriptionSignature: ['', Validators.required],
  });

  // onCheckboxClick(ev: any) {
  //   console.log('checkbox click', ev);
  //   this.submitEnrolService.prescriptionInfoDetails.controls.forEach(
  //     (control: JsonFormControls) => {
  //       if (control.name === `${ev.field.name}Pres`) {
  //         if (ev.isChecked) {
  //           control.display = true;
  //         } else {
  //           control.display = false;
  //         }
  //       }
  //     }
  //   );
  // }

  // onRadioClick(ev: any) {
  //   console.log(ev);
  //   this.submitEnrolService.clinicalInfoDetails.controls.forEach(
  //     (control: JsonFormControls) => {
  //       if (control.name === 'otherICD10Code') {
  //         if (ev === 'Other') {
  //           control.display = true;
  //         } else {
  //           control.display = false;
  //         }
  //       }
  //     }
  //   );
  // }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'select-prescription',
      form: {
        ...this.clinicalInfoForm.value,
        ...this.currentLineOfTherapyForm.value,
        ...this.prescriptionInfoForm.value,
      },
      nextScreen:
        actionType === 'back' ? 'select-medication' : 'attestation-details',
    });
  }
}
