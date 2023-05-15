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
      this.currentLineOfTherapyForm = this.fb.group({
        // currentLineOfTherapy: ['', Validators.required],
        // bRCATest: [''],
        // hRDTest: [''],
        // previousTherapies: [''],
        // latestHemoglobin: [''],
        // dateOfLastTransfusion: [''],
        // knownDrugAllergies: [''],
        // notes: [''],
      });
      this.prescriptionInfoForm = this.fb.group({
        // zejStd: this.fb.array([]),
        // zejStdPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: null, disabled: false }, Validators.required],
        //   refills: [{ value: null, disabled: false }, Validators.required],
        //   doa: [null, Validators.required],
        // }),
        // zejQSP: this.fb.array([]),
        // zejQSPPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null, Validators.required],
        // }),
        // zejBridge: this.fb.array([]),
        // zejBridgePres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null, Validators.required],
        // }),
        // ojjaaraStd: this.fb.array([]),
        // ojjaaraStdPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: null, disabled: false }, Validators.required],
        //   refills: [{ value: null, disabled: false }, Validators.required],
        //   doa: [null],
        // }),
        // ojjaaraQSP: this.fb.array([]),
        // ojjaaraQSPPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null],
        // }),
        // ojjaaraBridge: this.fb.array([]),
        // ojjaaraBridgePres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null],
        // }),
        jemperliIV: this.fb.array(['JemperliIV']),
        jemperliIVPres: this.fb.group({
          strength: [],
          qty: [{ value: null, disabled: true }],
          refills: [{ value: null, disabled: true }],
          doa: [null],
        }),
        // prescriptionSignature: ['', Validators.required],
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
        // previousTherapies: [''],
        // latestHemoglobin: [''],
        // dateOfLastTransfusion: [''],
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
        // ojjaaraStd: this.fb.array([]),
        // ojjaaraStdPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: null, disabled: false }, Validators.required],
        //   refills: [{ value: null, disabled: false }, Validators.required],
        //   doa: [null],
        // }),
        // ojjaaraQSP: this.fb.array([]),
        // ojjaaraQSPPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null],
        // }),
        // ojjaaraBridge: this.fb.array([]),
        // ojjaaraBridgePres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null],
        // }),
        // jemperliIV: this.fb.array(['JemperliIV']),
        // jemperliIVPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null],
        // }),
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
        // diagnosisICD10Code: ['', Validators.required],
        // otherICD10Code: [{ value: '', disabled: true }, Validators.required],
        // mismatchrepairstatusMMR: this.fb.array([]),
        // endometrialCancerPriortherapies: this.fb.array([]),
        secondaryDiagnosis: [''],
        secondaryDiagnosisICD10Code: [''],
      });
      this.currentLineOfTherapyForm = this.fb.group({
        // currentLineOfTherapy: ['', Validators.required],
        // bRCATest: [''],
        // hRDTest: [''],
        previousTherapies: [''],
        latestHemoglobin: [''],
        dateOfLastTransfusion: [''],
        knownDrugAllergies: [''],
        notes: [''],
      });
      this.prescriptionInfoForm = this.fb.group({
        // zejStd: this.fb.array([]),
        // zejStdPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: null, disabled: false }, Validators.required],
        //   refills: [{ value: null, disabled: false }, Validators.required],
        //   doa: [null, Validators.required],
        // }),
        // zejQSP: this.fb.array([]),
        // zejQSPPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null, Validators.required],
        // }),
        // zejBridge: this.fb.array([]),
        // zejBridgePres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null, Validators.required],
        // }),
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
        // jemperliIV: this.fb.array(['JemperliIV']),
        // jemperliIVPres: this.fb.group({
        //   strength: [],
        //   qty: [{ value: 15, disabled: true }],
        //   refills: [{ value: 14, disabled: true }],
        //   doa: [null],
        // }),
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

    if (event.target.checked) {
      if (formArrName === 'zejStd' || formArrName === 'ojjaaraStd') {
        form
          .get(formArrName + 'Pres')
          ?.get('qty')
          ?.setValidators(Validators.required);
        form
          .get(formArrName + 'Pres')
          ?.get('qty')
          ?.updateValueAndValidity();
        form
          .get(formArrName + 'Pres')
          ?.get('refills')
          ?.setValidators(Validators.required);
        form
          .get(formArrName + 'Pres')
          ?.get('refills')
          ?.updateValueAndValidity();
      }

      if (formArrName.includes('zej')) {
        form
          .get(formArrName + 'Pres')
          ?.get('doa')
          ?.setValidators(Validators.required);
        form
          .get(formArrName + 'Pres')
          ?.get('doa')
          ?.updateValueAndValidity();
      }

      if (formArrName.includes('ojjaara')) {
        form
          .get(formArrName + 'Pres')
          ?.get('strength')
          ?.setValidators(Validators.required);
        form
          .get(formArrName + 'Pres')
          ?.get('strength')
          ?.updateValueAndValidity();
      }
    } else {
      if (formArrName === 'zejStd' || formArrName === 'ojjaaraStd') {
        form
          .get(formArrName + 'Pres')
          ?.get('qty')
          ?.setValidators(null);
        form
          .get(formArrName + 'Pres')
          ?.get('qty')
          ?.updateValueAndValidity();

        form
          .get(formArrName + 'Pres')
          ?.get('refills')
          ?.setValidators(null);
        form
          .get(formArrName + 'Pres')
          ?.get('refills')
          ?.updateValueAndValidity();
      }

      if (formArrName.includes('zej')) {
        form
          .get(formArrName + 'Pres')
          ?.get('doa')
          ?.setValidators(null);
        form
          .get(formArrName + 'Pres')
          ?.get('doa')
          ?.updateValueAndValidity();
      }

      if (formArrName.includes('ojjaara')) {
        form
          .get(formArrName + 'Pres')
          ?.get('strength')
          ?.setValidators(null);
        form
          .get(formArrName + 'Pres')
          ?.get('strength')
          ?.updateValueAndValidity();
      }
    }
  }
  public findInvalidControls(form: any): any[] {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log(typeof controls[name]);
        if (typeof controls[name] === 'object') {
          const invNested = this.findInvalidControls(controls[name]);
          invalid.push(invNested);
        }
      }
    }
    return invalid;
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

    // console.log(this.prescriptionInfoForm,this.clinicalInfoForm,this.clinicalInfoForm);

    console.log(
      this.prescriptionInfoForm.valid,
      this.currentLineOfTherapyForm.valid,
      this.clinicalInfoForm.valid,
      this.checkOneMedicineSelected()
    );
    console.log(
      this.prescriptionInfoForm.value,
      this.currentLineOfTherapyForm.value,
      this.clinicalInfoForm.value
    );

    const invalidControls = this.findInvalidControls(this.prescriptionInfoForm);
    console.log(invalidControls);

    if (actionType === 'back') {
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
}
