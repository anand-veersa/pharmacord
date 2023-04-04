import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
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
      placeholder: '',
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
        for: 'Jemperli',
      },
      {
        label: 'Patient Assistance Program(PAP)',
        value: {
          Id: 3,
          Name: 'PatientAssistanceProgram',
        },
        for: 'Jemperli, Zejula, Ojjaara',
      },
      {
        label: 'Alternate Coverage Support',
        value: {
          Id: 12,
          Name: 'AlternateCoverageSupport',
        },
        for: 'Jemperli',
      },
      {
        label: 'Commercial Co-pay Assistance',
        value: {
          Id: 2,
          Name: 'CommercialCopayAssistance',
        },
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
      options: options.filter(option => option.for?.includes(selectedMedicine)),
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
        for: 'Ojjara',
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
    this.http
      .get('/assets/json/prescriber-form.json')
      .subscribe((data: any) => {
        this.prescriberDetails = data.leftPanel;
        this.prescriberDetails.controls.map(control => {
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
            console.log(control.options);
          }
        });
        this.shippingDetails = data.rightPanel;
        this.prescriberDetailForm = this.sharedService.buildForm(
          this.prescriberDetails
        );
        this.shippingDetailForm = this.sharedService.buildForm(
          this.shippingDetails
        );
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

  public resetForms(): void {
    if (this.medicationForm) this.medicationForm.reset();
    if (this.prescriberForm) this.prescriberForm.reset();
    if (this.servicesForm) this.servicesForm.reset();
    this.selectedFacilityId = 0;
  }
}
