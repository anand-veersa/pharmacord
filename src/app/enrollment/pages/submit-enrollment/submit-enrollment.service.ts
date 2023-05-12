import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AppConstants } from 'src/app/constants/app.constants';
import { EnrollmentFormPayload } from 'src/app/models/enrollment-form.model';
import {
  JsonFormControlOptions,
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
    const options: JsonFormControlOptions[] = [
      {
        label: 'Coverage Support',
        value: {
          Id: 1,
          Name: 'CoverageSupport',
        },
        tooltipContent:
          '<div class="services-tooltip lm-1"><ul><li>Benefits Investigation</li><li>Prior Authorization Support</li><li>Appeals Support</li><li>Claims Assistance</li></ul></div>',
        for: 'Jemperli',
      },
      {
        label: 'Patient Assistance Program(PAP)',
        value: {
          Id: 3,
          Name: 'PatientAssistanceProgram',
        },
        tooltipContent:
          '<div class="services-tooltip"><span>Uninsured patients who meet eligibility requirements may access medication free of charge through the Together with GSK Oncology Patient Assistance Program (PAP) offered by the GSK PAP Foundation. Medicare patients who meet program requirements may also be eligible for the Patient Assistance Program.</span></div>',
        for: 'Jemperli, Zejula, Ojjaara',
      },
      {
        label: 'Alternate Coverage Support',
        value: {
          Id: 12,
          Name: 'AlternateCoverageSupport',
        },
        tooltipContent:
          '<div class="services-tooltip lm-1"><ul><li>Information about Patient Advocacy Organizations</li><li> Information about Independent Co-Pay Foundations</li></ul></div>',
        for: 'Jemperli',
      },
      {
        label: 'Commercial Co-pay Assistance',
        value: {
          Id: 2,
          Name: 'CommercialCopayAssistance',
        },
        tooltipContent:
          '<div class="services-tooltip"><span>Eligible commercially insured patients could pay as little as $0 up to a total of $26,000 for up to 12 months for their medicine.</span></div>',
        for: 'Jemperli, Zejula, Ojjaara',
      },
      {
        label: 'Alternative Funding Sources Information',
        value: {
          Id: 2,
          Name: 'AlternativeFundingSourcesInformation',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label:
          'Benefits Investigation (Pharmacy and/or Medical Insurance Coverage)',
        value: {
          Id: 2,
          Name: 'BenefitsInvestigation',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'Home Health Coverage Information',
        value: {
          Id: 2,
          Name: 'HomeHealthCoverageInformation',
        },
        for: 'Zejula',
      },
      {
        label: 'Patient Advocacy Organization Information',
        value: {
          Id: 2,
          Name: 'PatientAdvocacyOrganizationInformation',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'Prior Authorization and Appeals Support',
        value: {
          Id: 2,
          Name: 'PriorAuthorizationAndAppealsSupport',
        },
        for: 'Zejula, Ojjaara',
      },
      {
        label: 'Quick Start and Bridge Programs',
        value: {
          Id: 2,
          Name: 'QuickStartAndBridgePrograms',
        },
        for: 'Zejula, Ojjaara',
      },
    ];
    // this.http.get("/assets/json/services-form.json").subscribe((data:any) => {
    //   const filteredOptions = data.controls[0].options.filter((option:JsonFormControlOptions) => option.for?.includes(selectedMedicine));
    //   data.controls[0].options = filteredOptions;
    //   this.filteredServices = data;
    //   this.servicesForm = this.sharedService.buildForm(this.filteredServices);
    //   console.log("form changesd", this.servicesForm);
    // });

    this.filteredServices.controls.pop();
    // if (this.servicesForm) return;
    this.filteredServices.controls.push({
      name: 'Services',
      value: '',
      label: '',
      placeholder: '',
      type: 'checkbox',
      validators: { required: true },
      options: options.filter(option => {
        if (
          selectedMedicine.toUpperCase() !==
            this.appConstants.MEDICINES.MEDICINE_1 &&
          option.tooltipContent
        )
          delete option.tooltipContent;
        return option.for?.includes(selectedMedicine);
      }),
    });
    this.servicesForm = this.sharedService.buildForm(this.filteredServices);
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
        for: 'Ojjaara',
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
    this.filteredPharmacies.controls.pop();
    // if (this.servicesForm) return;
    this.filteredPharmacies.controls.push({
      name: 'SpecialityPharmacy',
      value: '',
      label: '',
      placeholder: '',
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
      this.patientDetails.controls.map(control => {
        if (control.name === 'dob') {
          control.maxDate = new Date();
        }
        if (control.name === 'state') {
          control.options = this.sharedService.states;
        }
        if (control.name === 'selectName') {
          this.enrolService.medicineCases.subscribe((data: any[]) => {
            control.options = this.sharedService.getPatients(data).map(data => {
              return {
                label: data.PatientName,
                value: { patientId: data.PatientId, caseId: data.CaseId },
              };
            });
          });
          console.log(control.options);
        }
      });
      this.patientRepDetails = data.rightPanel;
      this.patientPapDetails = data.pap;
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
    console.log(this.selectedPrescriber, this.selectedFacility);
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
        this.shippingDetails.controls.map(control => {
          if (control.name === 'siteOfAdministration') {
            control.display =
              this.enrollmentFormPayload.DrugGroup === 'Jemperli'
                ? true
                : false;
          }
          if (control.name === 'state') {
            control.options = this.sharedService.states;
          }
          if (control.name === 'shippingAddressType') {
            control.display =
              this.enrollmentFormPayload.DrugGroup === 'Jemperli'
                ? false
                : true;
          }
        });
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
        console.log(this.shippingDetails);
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
        data.controls.forEach((item: any) => {
          if (item.type === 'select' || item.type === 'checkbox') {
            if (item.name === 'patientAssistanceProgram') {
              if (isPap > -1) item.display = true;
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

  public resetForms(): void {
    if (this.medicationForm) this.medicationForm.reset();
    if (this.prescriberForm) this.prescriberForm.reset();
    if (this.servicesForm) this.servicesForm.reset();
    this.selectedFacilityId = 0;
  }
}
