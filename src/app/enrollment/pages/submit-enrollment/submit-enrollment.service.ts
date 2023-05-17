import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AppConstants } from 'src/app/constants/app.constants';
import { EnrollmentFormPayload } from 'src/app/models/enrollment-form.model';
import {
  JsonFormControlOptions,
  JsonFormControls,
  JsonFormData,
} from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { EnrollmentService } from '../../enrollment.service';

@Injectable()
export class SubmitEnrollmentService {
  public headerTitle = new BehaviorSubject<string>(
    'Medication For Patient Enrollment'
  );
  public selectedPrescriberId = new BehaviorSubject<number>(0);
  public selectedPrescriber: any;
  public patientType: string = 'new';
  public medicationForm: FormGroup;
  public medicationJson: JsonFormData = { controls: [] };
  public prescriberForm: FormGroup;
  public prescribersJson: JsonFormData = { controls: [] };
  public selectedFacilityId: number;
  public selectedFacility: any[];
  public servicesForm: FormGroup;
  public filteredServices: JsonFormData = { controls: [] };
  public specialityPharmacyForm: FormGroup;
  public filteredPharmacies: JsonFormData = { controls: [] };
  public patientDetailForm: FormGroup;
  public patientDetails: JsonFormData = { controls: [] };
  public patientRepDetailForm: FormGroup;
  public patientRepDetails: JsonFormData = { controls: [] };
  public patientPapDetailForm: FormGroup;
  public patientPapDetails: JsonFormData = { controls: [] };
  public prescriberDetailForm: FormGroup;
  public prescriberDetails: JsonFormData = { controls: [] };
  public shippingDetailForm: FormGroup;
  public shippingDetails: JsonFormData = { controls: [] };
  public firstInsuranceForm: FormGroup;
  public firstInsuranceDetails: JsonFormData = { controls: [] };
  public secondInsuranceForm: FormGroup;
  public secondInsuranceDetails: JsonFormData = { controls: [] };
  public priorAuthForm: FormGroup;
  public priorAuthDetails: JsonFormData = { controls: [] };
  public appealForm: FormGroup;
  public appealDetails: JsonFormData = { controls: [] };

  public prescriptionInfoForm: FormGroup;
  public clinicalInfoForm: FormGroup;
  public currentLineOfTherapyForm: FormGroup;
  public attestationForm: FormGroup;
  public attestationDetails: JsonFormData = { controls: [] };

  public enrollmentFormPayload: EnrollmentFormPayload;
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private appConstants: AppConstants,
    private http: HttpClient,
    private enrolService: EnrollmentService
  ) {}

  public createSelectMedicationForm(): void {
    if (!this.medicationForm) {
      const options: JsonFormControlOptions[] = [];
      Object.values(this.appConstants.MEDICINES).forEach(medicine => {
        if (medicine === this.appConstants.MEDICINES.ALL) return;
        const formattedMed = this.sharedService.capitalize(medicine);
        options.push({ label: formattedMed, value: formattedMed });
      });
      this.medicationJson.controls.push({
        name: 'DrugGroup',
        value: '',
        label: '',
        placeholder: '',
        type: 'radio',
        validators: { required: true },
        options: options,
      });
      this.medicationForm = this.sharedService.buildForm(this.medicationJson);
    }
  }

  public createSelectPrescriberForm(): void {
    const options: JsonFormControlOptions[] = [];
    this.authService.user?.prescribers.forEach(prescriber => {
      options.push({
        label: `${prescriber.FirstName} ${prescriber.LastName}`,
        value: prescriber.ProviderId,
      });
    });
    this.prescribersJson.controls.push({
      name: 'Prescriber',
      value: '',
      label: '',
      placeholder: '-- Select one --',
      type: 'select',
      validators: { required: true },
      options: options,
    });
    this.prescriberForm = this.sharedService.buildForm(this.prescribersJson);
  }

  public createSelectServicesForm(selectedMedicine: string): void {
    this.http.get('/assets/json/services-form.json').subscribe((data: any) => {
      this.filteredServices = data;
      this.filteredServices.controls = this.filteredServices.controls.filter(
        (control: JsonFormControls) => control.for?.includes(selectedMedicine)
      );
      this.servicesForm = this.sharedService.buildForm(this.filteredServices);
    });
  }

  public createSelectPharmacyForm(selectedMedicine: string): void {
    const options: JsonFormControlOptions[] = [
      {
        label: 'No preference',
        value: {
          Id: 1,
          Name: 'No Preference',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'Accredo Health Group, Inc.',
        value: {
          Id: 3,
          Name: 'Accredo Health Group, Inc.',
        },
        for: 'Zejula',
      },
      {
        label: 'Biologics by McKesson',
        value: {
          Id: 12,
          Name: 'Biologics by McKesson',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'CVS Specialty Pharmacy',
        value: {
          Id: 2,
          Name: 'CVS Specialty Pharmacy',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'In-office dispensing site',
        value: {
          Id: 2,
          Name: 'AlternIn-office dispensing siteativeFundingSourcesInformation',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'Optum Specialty Pharmacy',
        value: {
          Id: 2,
          Name: 'Optum Specialty Pharmacy',
        },
        for: 'Zejula',
      },
      {
        label: 'Onco360 Oncology Pharmacy',
        value: {
          Id: 2,
          Name: 'Onco360 Oncology Pharmacy',
        },
        for: 'Ojjaara',
      },
    ];
    // this.http.get("/assets/json/services-form.json").subscribe((data:any) => {
    //   this.filteredServices = data;
    //   this.filteredServices.controls= this.filteredServices.controls.filter((control:JsonFormControls) =>  control.for?.includes(selectedMedicine));
    //   this.servicesForm = this.sharedService.buildForm(this.filteredServices);
    //   // console.log("form changesd", this.servicesForm);
    // });
    this.filteredPharmacies.controls = [];
    this.filteredPharmacies.controls.push({
      name: 'SpecialityPharmacy',
      value: '',
      label: '',
      placeholder: '',
      class: '',
      type: 'radio',
      validators: { required: true },
      options: options.filter(option => option.for?.includes(selectedMedicine)),
    });
    this.specialityPharmacyForm = this.sharedService.buildForm(
      this.filteredPharmacies
    );
  }

  public createSelectPatientForm(): void {
    this.http.get('/assets/json/patient-form.json').subscribe((data: any) => {
      this.patientDetails = data.leftPanel;
      this.patientDetails.controls = this.patientDetails.controls.filter(
        (control, index) => {
          if (this.patientType === 'new') {
            if (control.name === 'selectName') return;
          } else {
            if (control.name === 'firstName' || control.name === 'lastName') {
              return;
            }
            if (control.name === 'sex' || control.name === 'dob') {
              control.disabled = true;
            }
          }
          if (control.name === 'dob') {
            control.maxDate = new Date();
          }
          if (control.name === 'state') {
            control.options = this.sharedService.states;
          }
          if (control.name === 'selectName') {
            this.enrolService.medicineCases.subscribe((data: any[]) => {
              control.options = this.sharedService
                .getPatients(data)
                .map(data => {
                  return {
                    label: data.PatientName,
                    value: { patientId: data.PatientId, caseId: data.CaseId },
                  };
                });
            });
          }
          return control;
        }
      );

      this.patientRepDetails = data.rightPanel;
      this.patientPapDetails = data.pap;
      this.patientRepDetails.controls = this.patientRepDetails.controls.filter(
        control => {
          if (
            this.enrollmentFormPayload.DrugGroup === 'Jemperli' &&
            (control.name === 'repCaregiverName' ||
              control.name === 'repCaregiverRelation' ||
              control.name === 'repCaregiverPhone')
          )
            return;
          if (
            this.enrollmentFormPayload.DrugGroup !== 'Jemperli' &&
            (control.name === 'altContactFirstName' ||
              control.name === 'altContactLastName' ||
              control.name === 'altContactPhone' ||
              control.name === 'altContactRelation')
          )
            return;
          if (
            control.name === 'bestContactTime' &&
            this.enrollmentFormPayload.DrugGroup !== 'Jemperli'
          )
            return;
          return control;
        }
      );

      this.patientDetailForm = this.sharedService.buildForm(
        this.patientDetails
      );
      this.patientRepDetailForm = this.sharedService.buildForm(
        this.patientRepDetails
      );
      this.patientPapDetailForm = this.sharedService.buildForm(
        this.patientPapDetails
      );
    });
  }

  public createPrescriberForm(): void {
    this.http
      .get('/assets/json/prescriber-form.json')
      .subscribe((data: any) => {
        this.prescriberDetails = data.leftPanel;
        this.prescriberDetails.controls.map(control => {
          if (control.name === 'state') {
            control.options = this.sharedService.states;
          }
        });
        this.shippingDetails = data.rightPanel;
        this.shippingDetails.controls = this.shippingDetails.controls.filter(
          control => {
            if (control.name === 'state') {
              control.options = this.sharedService.states;
            }
            if (
              control.name === 'siteOfAdministration' &&
              this.enrollmentFormPayload.DrugGroup !== 'Jemperli'
            )
              return;
            if (
              control.name === 'shippingAddressType' &&
              this.enrollmentFormPayload.DrugGroup === 'Jemperli'
            )
              return;
            return control;
          }
        );
        this.prescriberDetailForm = this.sharedService.buildForm(
          this.prescriberDetails
        );
        this.prescriberDetailForm.patchValue({
          firstName: this.selectedPrescriber.FirstName,
          lastName: this.selectedPrescriber.LastName,
          npi: this.selectedPrescriber.NPI,
          facilityName:
            this.selectedFacility[0].OfficeName ||
            this.selectedFacility[0].PracticeGroup,
          mailingAddress1: this.selectedFacility[0].Address.Line1,
          mailingAddress2: this.selectedFacility[0].Address.Line2,
          city: this.selectedFacility[0].Address.City,
          state: this.selectedFacility[0].Address.State,
          zipcode: this.selectedFacility[0].Address.Zipcode,
        });
        this.shippingDetailForm = this.sharedService.buildForm(
          this.shippingDetails
        );
      });
  }

  public createInsuranceForm(): void {
    this.http.get('/assets/json/insurance-form.json').subscribe((data: any) => {
      data.primaryMedical.controls[0].options =
        data.primaryMedical.controls[0].options.filter(
          (option: JsonFormControlOptions) =>
            !option.for ||
            option.for.includes(this.enrollmentFormPayload.DrugGroup)
        );
      data.secondaryMedical.controls[0].options =
        data.secondaryMedical.controls[0].options.filter(
          (option: JsonFormControlOptions) =>
            !option.for ||
            option.for.includes(this.enrollmentFormPayload.DrugGroup)
        );
      data.prescriptionInsurance.controls[0].options =
        data.prescriptionInsurance.controls[0].options.filter(
          (option: JsonFormControlOptions) =>
            !option.for ||
            option.for.includes(this.enrollmentFormPayload.DrugGroup)
        );
      this.firstInsuranceDetails = data.primaryMedical;
      if (this.enrollmentFormPayload.DrugGroup === 'Jemperli') {
        this.secondInsuranceDetails = data.secondaryMedical;
      } else {
        this.secondInsuranceDetails = data.prescriptionInsurance;
        this.priorAuthDetails = data.priorAuth;
        this.appealDetails = data.appeal;
      }
      this.firstInsuranceForm = this.sharedService.buildForm(
        this.firstInsuranceDetails
      );
      this.secondInsuranceForm = this.sharedService.buildForm(
        this.secondInsuranceDetails
      );
      this.priorAuthForm = this.sharedService.buildForm(this.priorAuthDetails);
      this.appealForm = this.sharedService.buildForm(this.appealDetails);
    });
  }

  public getPatientDetails(patientId: number, caseId: string = ''): any {
    let patientData = {};
    this.enrolService.medicineCases.subscribe((patients: any[]) => {
      patientData = patients.find(patient => {
        if (caseId) {
          if (patient.PatientId == patientId && patient.CaseId === caseId) {
            return patient;
          }
        } else {
          if (patient.patientId === patientId) return patient;
        }
      });
    });
    return patientData;
  }

  public createAttestationForm(): void {
    this.http
      .get('/assets/json/attestation-form.json')
      .subscribe((data: any) => {
        const isPap = this.servicesForm
          ?.get('Services')
          ?.value.findIndex(
            (el: any) => el.Name === 'PatientAssistanceProgram'
          );
        const userRolePkId = this.authService.user?.role?.RolePkId;
        const arr = [
          'textingConsent',
          'patientAssistanceProgram',
          'patientSupportProgram',
          'hippaAuthorization',
          'patientSignatureOptions',
          'patientRepresentativeName',
          'relationshipToPatient',
          'patientEmail',
          'representativeEmail',
        ];

        data.controls.forEach((item: any) => {
          if (userRolePkId === 4) {
            if (item.name === 'prescriberSignatureOptions') {
              item.options.splice(0, 1);
              item.value = 'Download to print and sign';
            }
            if (arr.includes(item.name)) item.display = false;
          }
          if (item.type === 'select' || item.type === 'checkbox') {
            if (item.name === 'patientAssistanceProgram') {
              if (isPap) item.display = true;
              else item.display = false;
            }
            item.options = item.options.filter(
              (option: JsonFormControlOptions) =>
                !option.for ||
                option.for.includes(this.enrollmentFormPayload.DrugGroup)
            );
          }
        });
        this.attestationDetails = data;

        this.attestationForm = this.sharedService.buildForm(
          this.attestationDetails
        );
      });
  }
  public resetForms(drugChangeReset: boolean = false): void {
    if (this.medicationForm && !drugChangeReset) this.medicationForm.reset();
    this.selectedFacilityId = 0;
    this.selectedFacility = [];
    if (this.prescriberForm) this.prescriberForm.reset();
    if (this.servicesForm) {
      this.filteredServices = { controls: [] };
      this.servicesForm.reset();
    }
    if (this.specialityPharmacyForm) this.specialityPharmacyForm.reset();
    if (this.patientDetailForm) this.patientDetailForm.reset();
    if (this.patientRepDetailForm) this.patientRepDetailForm.reset();
    if (this.patientPapDetailForm) this.patientPapDetailForm.reset();
    if (this.prescriberDetailForm) this.prescriberDetailForm.reset();
    if (this.shippingDetailForm) this.shippingDetailForm.reset();
    if (this.firstInsuranceForm) this.firstInsuranceForm.reset();
    if (this.secondInsuranceForm) this.secondInsuranceForm.reset();
    console.log('form', this.servicesForm);
  }

  private clearFormArray(form: any, control: string) {
    while (form.controls[control].length !== 0) {
      form.controls[control].removeAt(0);
    }
  }
}
