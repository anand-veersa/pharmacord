import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
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

  medicine = '';

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

  clinicalInfoForm: any;
  currentLineOfTherapyForm: any;
  prescriptionInfoForm: any;

  ngOnInit(): void {
    this.medicine =
      this.submitEnrolService.enrollmentFormPayload.DrugGroup.toUpperCase();

    if (this.medicine === this.appConstants.MEDICINES.MEDICINE_1) {
      this.clinicalInfoForm = this.fb.group({
        patientFirstName: ['', Validators.required],
        patientLastName: ['', Validators.required],
        patientDateOfBirth: ['', Validators.required],
        diagnosisICD10Code: ['', Validators.required],
        otherICD10Code: [{ value: '', disabled: true }, Validators.required],
        mismatchrepairstatusMMR: this.fb.array([], Validators.required),
        endometrialCancerPriortherapies: this.fb.array([], Validators.required),
      });
      this.currentLineOfTherapyForm = this.fb.group({});
      this.prescriptionInfoForm = this.fb.group({
        jemperliIV: this.fb.array(['JemperliIV']),
        jemperliIVPres: this.fb.group({
          strength: [],
          qty: [{ value: null, disabled: true }],
          refills: [{ value: null, disabled: true }],
          doa: [null],
        }),
      });
    } else if (this.medicine === this.appConstants.MEDICINES.MEDICINE_2) {
      this.clinicalInfoForm = this.fb.group({
        patientFirstName: ['', Validators.required],
        patientLastName: ['', Validators.required],
        patientDateOfBirth: ['', Validators.required],
        treatmentStartDate: [''],
        primaryDiagnosis: ['', Validators.required],
        primaryDiagnosisICD10Code: ['', Validators.required],
        secondaryDiagnosis: [''],
        secondaryDiagnosisICD10Code: [''],
      });
      this.currentLineOfTherapyForm = this.fb.group({
        currentLineOfTherapy: [''],
        bRCATest: [''],
        hRDTest: [''],

        knownDrugAllergies: [''],
        notes: [''],
      });
      this.prescriptionInfoForm = this.fb.group({
        zejStd: this.fb.array([]),
        zejStdPres: this.fb.group({
          strength: [],
          qty: [{ value: null, disabled: false }],
          refills: [{ value: null, disabled: false }],
          doa: [null],
        }),
        zejQSP: this.fb.array([]),
        zejQSPPres: this.fb.group({
          strength: [],
          qty: [{ value: 15, disabled: true }],
          refills: [{ value: 14, disabled: true }],
          doa: [null],
        }),
        zejBridge: this.fb.array([]),
        zejBridgePres: this.fb.group({
          strength: [],
          qty: [{ value: 15, disabled: true }],
          refills: [{ value: 14, disabled: true }],
          doa: [null],
        }),

        prescriptionSignature: ['', Validators.required],
      });
    } else if (this.medicine === this.appConstants.MEDICINES.MEDICINE_3) {
      this.clinicalInfoForm = this.fb.group({
        patientFirstName: ['', Validators.required],
        patientLastName: ['', Validators.required],
        patientDateOfBirth: [''],
        treatmentStartDate: [''],
        primaryDiagnosis: [''],
        primaryDiagnosisICD10Code: [''],

        secondaryDiagnosis: [''],
        secondaryDiagnosisICD10Code: [''],
      });
      this.currentLineOfTherapyForm = this.fb.group({
        previousTherapies: [''],
        latestHemoglobin: [''],
        dateOfLastTransfusion: [''],
        knownDrugAllergies: [''],
        notes: [''],
      });
      this.prescriptionInfoForm = this.fb.group({
        ojjaaraStd: this.fb.array([]),
        ojjaaraStdPres: this.fb.group({
          strength: [],
          qty: [{ value: null, disabled: false }],
          refills: [{ value: null, disabled: false }],
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

        prescriptionSignature: ['', Validators.required],
      });
    }

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
      ?.valueChanges.subscribe((val: any) => {
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

  public onCheckChange(ev: {
    form: FormGroup;
    formArrName: string;
    ev: any;
    from?: string;
  }): void {
    const form: FormGroup = ev.form;
    const formArrName: string = ev.formArrName;
    const event = ev.ev;

    const formArray: FormArray = form.get(formArrName) as FormArray;

    if (ev.from !== 'init') {
      formArray.markAsTouched();
    }

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

    if (formArray.length === 0 && formArray.hasValidator(Validators.required)) {
      formArray.setErrors({ required: true });
    }
    this.handleShowHideValidation(event.target.checked, form, formArrName);
  }

  public checkOneMedicineSelected(): boolean {
    if (this.medicine === this.appConstants.MEDICINES.MEDICINE_1) {
      return !!this.prescriptionInfoForm.get('jemperliIV')?.value?.length;
    } else if (this.medicine === this.appConstants.MEDICINES.MEDICINE_2) {
      return !!(
        this.prescriptionInfoForm.get('zejStd')?.value?.length ||
        this.prescriptionInfoForm.get('zejQSP')?.value?.length ||
        this.prescriptionInfoForm.get('zejBridge')?.value?.length
      );
    } else if (this.medicine === this.appConstants.MEDICINES.MEDICINE_3) {
      return !!(
        this.prescriptionInfoForm.get('ojjaaraStd')?.value?.length ||
        this.prescriptionInfoForm.get('ojjaaraQSP')?.value?.length ||
        this.prescriptionInfoForm.get('ojjaaraBridge')?.value?.length
      );
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
        actionType === 'back' ? 'select-medication' : 'attestation-details',
    });
  }

  public isNextDisabled(): boolean {
    const isFormValid =
      this.prescriptionInfoForm.valid &&
      this.clinicalInfoForm.valid &&
      this.currentLineOfTherapyForm.valid &&
      this.checkOneMedicineSelected();
    return !isFormValid;
  }

  private fillCheckBoxes(persistedform: FormGroup, localForm: FormGroup): void {
    Object.entries(persistedform.value).forEach(([key, value]) => {
      if (isArray(value) && value?.length && localForm.contains(key)) {
        value.forEach(e => {
          this.onCheckChange({
            form: localForm,
            formArrName: key,
            ev: { target: { checked: true, value: e } },
            from: 'init',
          });
        });
      }
    });
  }

  private handleShowHideValidation(
    checked: boolean,
    form: FormGroup,
    formArrName: string
  ): void {
    if (checked) {
      if (formArrName === 'zejStd' || formArrName === 'ojjaaraStd') {
        this.addDynamicValidator(
          form,
          formArrName + 'Pres' + '.qty',
          Validators.required
        );
        this.addDynamicValidator(
          form,
          formArrName + 'Pres' + '.refills',
          Validators.required
        );
      }

      if (formArrName.includes('zej')) {
        this.addDynamicValidator(
          form,
          formArrName + 'Pres' + '.doa',
          Validators.required
        );
      }

      if (formArrName.includes('ojjaara')) {
        this.addDynamicValidator(
          form,
          formArrName + 'Pres' + '.strength',
          Validators.required
        );
      }
    } else {
      if (formArrName === 'zejStd' || formArrName === 'ojjaaraStd') {
        this.addDynamicValidator(form, formArrName + 'Pres' + '.qty', null);
        this.addDynamicValidator(form, formArrName + 'Pres' + '.refills', null);
      }

      if (formArrName.includes('zej')) {
        this.addDynamicValidator(form, formArrName + 'Pres' + '.doa', null);
      }

      if (formArrName.includes('ojjaara')) {
        this.addDynamicValidator(
          form,
          formArrName + 'Pres' + '.strength',
          null
        );
      }
    }
  }

  private addDynamicValidator(
    form: FormGroup,
    formArrName: string,
    validators: ValidatorFn | ValidatorFn[] | null
  ) {
    form.get(formArrName)?.setValidators(validators);
    form.get(formArrName)?.updateValueAndValidity();
  }
}
