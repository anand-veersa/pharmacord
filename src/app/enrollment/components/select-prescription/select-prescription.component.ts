import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isArray } from 'lodash';
import { AppConstants } from 'src/app/constants/app.constants';
import { SubmitEnrollmentService } from 'src/app/enrollment/pages/submit-enrollment/submit-enrollment.service';
import { SharedService } from 'src/app/shared/services/shared.service';

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
    public fb: FormBuilder,
    public appConstants: AppConstants,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.medicine =
      this.submitEnrolService.enrollmentFormPayload.DrugGroup.toUpperCase();
    if (this.submitEnrolService.clinicalInfoForm?.value) {
      this.clinicalInfoForm.patchValue(
        this.submitEnrolService.clinicalInfoForm.value
      );
      this.fillCheckBoxes(
        this.submitEnrolService.clinicalInfoForm,
        this.clinicalInfoForm
      );
    }
    if (this.submitEnrolService.currentLineOfTherapyForm?.value) {
      this.currentLineOfTherapyForm.patchValue(
        this.submitEnrolService.currentLineOfTherapyForm.value
      );
      this.fillCheckBoxes(
        this.submitEnrolService.currentLineOfTherapyForm,
        this.currentLineOfTherapyForm
      );
    }
    if (this.submitEnrolService.prescriptionInfoForm?.value) {
      this.prescriptionInfoForm.patchValue(
        this.submitEnrolService.prescriptionInfoForm.value
      );
      this.fillCheckBoxes(
        this.submitEnrolService.prescriptionInfoForm,
        this.prescriptionInfoForm
      );
    }

    this.clinicalInfoForm
      .get('diagnosisICD10Code')
      ?.valueChanges.subscribe(val => {
        if (val === 'Other') {
          this.clinicalInfoForm.controls['otherICD10Code'].setValidators([
            Validators.required,
          ]);
          this.clinicalInfoForm.controls['otherICD10Code'].enable();
        } else {
          this.clinicalInfoForm.controls['otherICD10Code'].setValidators(null);
          this.clinicalInfoForm.controls['otherICD10Code'].disable();
        }
        this.clinicalInfoForm.controls[
          'otherICD10Code'
        ].updateValueAndValidity();
      });
  }

  medicine = '';

  clinicalInfoForm = this.fb.group({
    patientFirstName: ['', Validators.required],
    patientLastName: ['', Validators.required],
    patientDateOfBirth: ['', Validators.required],
    treatmentStartDate: [''],
    primaryDiagnosis: ['', Validators.required],
    primaryDiagnosisICD10Code: ['', Validators.required],
    diagnosisICD10Code: ['', Validators.required],
    otherICD10Code: [{ value: '', disabled: true }, Validators.required],
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
      qty: [{ value: null, disabled: false }, Validators.required],
      refills: [{ value: null, disabled: false }, Validators.required],
      doa: [null, Validators.required],
    }),
    zejQSP: this.fb.array([]),
    zejQSPPres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [null, Validators.required],
    }),
    zejBridge: this.fb.array([]),
    zejBridgePres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [null, Validators.required],
    }),
    ojjaaraStd: this.fb.array([]),
    ojjaaraStdPres: this.fb.group({
      strength: [],
      qty: [{ value: null, disabled: false }, Validators.required],
      refills: [{ value: null, disabled: false }, Validators.required],
      doa: [null],
    }),
    ojjaaraQSP: this.fb.array([]),
    ojjaaraQSPPres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [null],
    }),
    ojjaaraBridge: this.fb.array([]),
    ojjaaraBridgePres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [null],
    }),
    jemperliIV: this.fb.array([]),
    jemperliIVPres: this.fb.group({
      strength: [],
      qty: [{ value: 15, disabled: true }],
      refills: [{ value: 14, disabled: true }],
      doa: [null],
    }),
    prescriptionSignature: ['', Validators.required],
  });

  presSignatureSelectField = {
    name: 'prescriptionSignature',
    value: '',
    display: true,
    label: 'Prescription Signature',
    placeholder: 'Select Prescription Signature',
    type: 'select',
    for: 'Zejula , Ojjaara ',
    validators: {
      required: true,
    },
    options: [
      {
        label: 'Dispense as written',
        value: 'Dispense as written',
      },
      {
        label: 'Substitute Permitted',
        value: 'Substitute Permitted',
      },
    ],
  };

  patientDateOfBirthField = {
    name: 'patientDateOfBirth',
    value: '',
    display: true,
    label: 'Date of Birth',
    placeholder: 'mm/dd/yyyy',
    type: 'date',
    validators: {
      required: true,
    },
    disabled: false,
    for: 'Zejula, Ojjaara, Jemperli',
  };

  treatmentStartDate = {
    name: 'treatmentStartDate',
    value: '',
    display: true,
    label: 'Treatment Start Date',
    placeholder: 'mm/dd/yyyy',
    type: 'date',
    validators: {},
    disabled: false,
    for: 'Zejula, Ojjaara',
  };

  dateOfLastTransfusion = {
    name: 'dateOfLastTransfusion',
    value: '',
    display: true,
    label: 'Date of Last Transfusion',
    placeholder: '',
    type: 'date',
    validators: {},
    for: 'Ojjaara',
  };

  public onCheckChange(ev: {
    form: FormGroup;
    formArrName: string;
    ev: any;
  }): void {
    const form: FormGroup = ev.form;
    const formArrName: string = ev.formArrName;
    const event = ev.ev;

    const formArray: FormArray = form.get(formArrName) as FormArray;

    formArray.markAsTouched();

    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;

      formArray.controls.forEach((ctrl: AbstractControl<any, any>) => {
        if (ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }

    if (formArray.length === 0) {
      formArray.setErrors({ required: true });
    }
  }

  public checkOneMedicineSelected(): boolean {
    if (this.medicine === 'Zejula') {
      return !!(
        this.prescriptionInfoForm.get('zejStd')?.value?.length ||
        this.prescriptionInfoForm.get('zejQSP')?.value?.length ||
        this.prescriptionInfoForm.get('zejBridge')?.value?.length
      );
    } else if (this.medicine === 'Ojjaara') {
      return !!(
        this.prescriptionInfoForm.get('ojjaaraStd')?.value?.length ||
        this.prescriptionInfoForm.get('ojjaaraQSP')?.value?.length ||
        this.prescriptionInfoForm.get('ojjaaraBridge')?.value?.length
      );
    } else if (this.medicine === 'Jemperli') {
      return !!this.prescriptionInfoForm.get('jemperliIV')?.value?.length;
    }
    return false;
  }

  public onAction(actionType: string): void {
    this.submitEnrolService.clinicalInfoForm = this.clinicalInfoForm;
    this.submitEnrolService.currentLineOfTherapyForm =
      this.currentLineOfTherapyForm;
    this.submitEnrolService.prescriptionInfoForm = this.prescriptionInfoForm;

    this.action.emit({
      actionType,
      formName: 'select-prescription',
      form: {
        clinicalInfoForm: { ...this.clinicalInfoForm.getRawValue() },
        currentLineOfTherapyForm: {
          ...this.currentLineOfTherapyForm.getRawValue(),
        },
        prescriptionInfoForm: { ...this.prescriptionInfoForm.getRawValue() },
      },
      nextScreen:
        actionType === 'back' ? 'select-insurance' : 'attestation-details',
    });
  }

  private fillCheckBoxes(persistedform: FormGroup, localForm: FormGroup): void {
    Object.entries(persistedform.value).forEach(([key, value]) => {
      if (isArray(value) && value?.length) {
        value.forEach(e => {
          this.onCheckChange({
            form: localForm,
            formArrName: key,
            ev: { target: { checked: true, value: e } },
          });
        });
      }
    });
  }
}
