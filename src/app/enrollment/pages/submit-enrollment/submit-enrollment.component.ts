import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EnrollmentScreenNextData } from 'src/app/models/enrollment-form.model';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { EnrollmentService } from '../../enrollment.service';
import { SubmitEnrollmentService } from './submit-enrollment.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AppConstants } from 'src/app/constants/app.constants';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-submit-enrollment',
  templateUrl: './submit-enrollment.component.html',
  styleUrls: ['./submit-enrollment.component.scss'],
})
export class SubmitEnrollmentComponent implements OnInit, OnDestroy {
  @ViewChild('enrollmentForm', { read: ViewContainerRef })
  enrollmentForm: ViewContainerRef;
  public title: string;
  public displayScreen: string = 'select-medication';
  public selectedFacility: any;
  public formInitiated: boolean = false;
  public openExitDialog: boolean = false;
  public prescriberListJson: JsonFormData = { controls: [] };
  public selectPrescriberForm: FormGroup;
  public exitSubject = new Subject<boolean>();
  public stepperCount: number = 0;

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private enrolService: EnrollmentService,
    private http: HttpClient,
    private sharedService: SharedService,
    private appConstants: AppConstants
  ) {}

  ngOnInit(): void {
    this.http
      .get('/assets/json/patient-referral.json')
      .subscribe(
        (data: any) => (this.submitEnrolService.enrollmentFormPayload = data)
      );
  }

  public onAction({
    actionType,
    formName,
    form,
    nextScreen,
  }: EnrollmentScreenNextData): void {
    this.stepperCount =
      actionType === 'next' ? this.stepperCount + 1 : this.stepperCount - 1;
    // TODO: optimize this
    this.displayScreen = nextScreen;
    // if(actionType=== 'next') {
    if (formName === 'select-medication') {
      if (form.drugChanged && actionType === 'next')
        this.submitEnrolService.resetForms(true);
      this.submitEnrolService.enrollmentFormPayload.DrugGroup =
        form.drug.DrugGroup;
      this.formInitiated = true;
      // if (actionType === 'next') this.submitEnrolService.resetForms();
    }
    if (formName === 'select-prescriber') {
      this.selectedFacility = form;
    }
    if (formName === 'select-services') {
      if (actionType === 'back') return;
      for (const key in form.services) {
        const val = form.services[key];
        if (val)
          this.submitEnrolService.enrollmentFormPayload.EnrollmentServiceRequests.push(
            val
          );
      }
      this.submitEnrolService.enrollmentFormPayload.PreferredSpecialityPharmacy =
        form.pharmacy.SpecialityPharmacy;
    }
    if (formName === 'select-patient') {
      console.log(form);
      this.setPatientDetails(form);
    }
    if (formName === 'prescriber-details') {
      this.setPrescriberDetails(form);
      // console.log(form);
    }
    if (formName === 'select-insurance') {
      this.setInsuranceDetails(form);
    }
    if (formName === 'attestation-details') {
      console.log(form);
    }
    console.log(this.submitEnrolService.enrollmentFormPayload);
  }

  // private getComponentByScreen(): void {
  //   const compByScreen = this.componentsByScreen.find(
  //     c => c.screen === this.displayScreen
  //   );
  //   const compInstance: ComponentType =
  //     compByScreen?.component || SelectMedicationComponent;
  //   this.enrollmentForm.clear();
  //   const dynamicComponent = this.enrollmentForm.createComponent(compInstance);
  //   if (compInstance !== SelectMedicationComponent) {
  //     dynamicComponent.setInput(
  //       'selectedMedication',
  //       this.enrollmentFormPayload.DrugGroup
  //     );
  //   }
  //   if (compInstance === SelectPrescriberComponent) {
  //     dynamicComponent.instance.prescriberListJson.subscribe(
  //       (json: JsonFormData) => (this.prescriberListJson = json)
  //     );
  //     dynamicComponent.instance.selectPrescriberForm.subscribe(
  //       (form: FormGroup) => (this.selectPrescriberForm = form)
  //     );
  //   }
  //   dynamicComponent.instance.title.subscribe(
  //     (title: string) => (this.title = title)
  //   );
  //   dynamicComponent.instance.action.subscribe(
  //     (data: EnrollmentScreenNextData) => this.onAction(data)
  //   );
  //   this.cdr.detectChanges();
  // }

  public getPrescribersFormData(formData: any): void {
    this.selectPrescriberForm = formData.selectPrescriberForm;
    this.prescriberListJson = formData.prescriberListJson;
  }

  public openDialog(): void {
    this.openExitDialog = true;
  }

  public confirmExit(action: boolean) {
    this.openExitDialog = false;
    this.exitSubject.next(action);
  }

  private setPatientDetails(patient: any): void {
    const patientPhone = [];
    if (patient.homePhone)
      patientPhone.push({ Type: 'Home', Number: patient.homePhone });
    if (patient.cellPhone)
      patientPhone.push({ Type: 'Mobile', Number: patient.cellPhone });
    const caregiverName = patient.repCaregiverName
      ? patient.repCaregiverName.split(' ')
      : [];
    const selectedPatientName = patient.selectedPatient
      ? patient.selectedPatient.PatientName.split(' ')
      : [];
    const firstName =
      selectedPatientName.length > 0
        ? selectedPatientName[0]
        : patient.firstName;
    const lastName =
      selectedPatientName.length > 1
        ? selectedPatientName.at(-1)
        : patient.lastName;
    this.submitEnrolService.enrollmentFormPayload.Patient = {
      FirstName: firstName,
      LastName: lastName,
      DOB: this.sharedService.getFormattedDate(
        this.submitEnrolService.patientDetailForm.controls['dob'].getRawValue(),
        true
      ),
      Gender:
        this.submitEnrolService.patientDetailForm.controls['sex'].getRawValue(),
      MMRStatus: [],
      DiagnosisCodes: [],
      OtherDiagnosisCodes: '',
      PriorTherapies: [],
      OtherPriorTherapies: [],
      Address1: patient.patientAddress1,
      Address2: patient.patientAddress2,
      City: patient.city,
      State: patient.state,
      Zip: patient.zipcode,
      PatientEmailAddress: patient.email,
      PatientId: patient.selectedPatient?.PatientId ?? null,
      Phones: patientPhone,
      AlternateContact: {
        FirstName: caregiverName.length ? caregiverName[0] : '',
        LastName: caregiverName.length > 1 ? caregiverName.at(-1) : '',
        RelationshipToPatient: patient.repCaregiverRelation,
        Phone: patient.repCaregiverPhone,
      },
      BestContactTime: patient.bestContactTime,
    };
  }

  private setPrescriberDetails(prescriber: any): void {
    this.submitEnrolService.enrollmentFormPayload.Provider = {
      FirstName: this.submitEnrolService.selectedPrescriber.FirstName,
      LastName: this.submitEnrolService.selectedPrescriber.LastName,
      NPI: this.submitEnrolService.selectedPrescriber.NPI,
      TaxID: prescriber.taxId,
      Facility: {
        Id: this.submitEnrolService.selectedFacilityId,
        NPI: prescriber.facilityNpi,
        TaxId: prescriber.facilitytaxId,
        Name:
          this.submitEnrolService.selectedFacility[0].OfficeName ||
          this.submitEnrolService.selectedFacility[0].PracticeGroup,
        Address1: this.submitEnrolService.selectedFacility[0].Address.Line1,
        Address2: this.submitEnrolService.selectedFacility[0].Address.Line2,
        City: this.submitEnrolService.selectedFacility[0].Address.City,
        State: this.submitEnrolService.selectedFacility[0].Address.State,
        Zip: this.submitEnrolService.selectedFacility[0].Address.Zipcode,
        OfficeContactName: prescriber.officeContactName,
      },
      Phones: [
        {
          Number: prescriber.officeContactPhone,
          Ext: prescriber.officeContactExt,
        },
      ],
      Fax: prescriber.fax,
      Email: prescriber.officeContactEmail,
      OtherFacilities: [
        {
          Name: prescriber.shippingFacilityName,
          OfficeContactName: prescriber.recipientName,
          Phone: prescriber.phone,
          Address1: prescriber.street,
          Address2: null,
          City: prescriber.city,
          State: prescriber.state,
          Zip: prescriber.zipcode,
          FacilityType: prescriber.siteOfAdministration,
        },
      ],
    };
  }

  private setInsuranceDetails(insurance: any): void {
    console.log(insurance);
    // appealForm
    // priorAuthForm
    // secondInsuranceForm
    // firstInsuranceForm
    const medicalPlansData: any[] = [];
    const pharmacyPlansData: any[] = [];
    let medicalPlanFirstData: any = {};
    let medicalPlanSecondData: any = {};
    if (insurance.firstInsuranceForm.coverageType.length) {
      medicalPlanFirstData = {
        Type: insurance.firstInsuranceForm.coverageType,
        PolicyHolderEmployer: insurance.firstInsuranceForm.policyHolderName,
        PlanName: insurance.firstInsuranceForm.insuranceName,
        Phone: insurance.firstInsuranceForm.phone,
        PlanRank: 'Primary',
        PolicyID: insurance.firstInsuranceForm.policyId,
        SubscriberName: insurance.firstInsuranceForm.policyHolderName,
        SubscriberDOB: insurance.firstInsuranceForm.policyHolderDob,
        RelationshipToSubscriber:
          insurance.firstInsuranceForm.relationToPatient,
        GroupNo: insurance.firstInsuranceForm.group,
        AttachDoc: insurance.firstInsuranceForm.group.firstInsuranceFiles,
      };
      medicalPlansData.push(medicalPlanFirstData);
    }

    if (insurance.secondInsuranceForm.coverageType.length) {
      medicalPlanSecondData = {
        Type: insurance.secondInsuranceForm.coverageType,
        PolicyHolderEmployer: insurance.secondInsuranceForm.insurancePayer,
        PlanName: insurance.secondInsuranceForm.insuranceName,
        Phone: insurance.secondInsuranceForm.phone,
        PlanRank: 'Secondary',
        PolicyID: insurance.secondInsuranceForm.policyId,
        SubscriberName: insurance.secondInsuranceForm.policyHolderName,
        SubscriberDOB: insurance.secondInsuranceForm.policyHolderDob,
        RelationshipToSubscriber:
          insurance.secondInsuranceForm.relationToPatient,
        GroupNo: insurance.secondInsuranceForm.group,
        AttachDoc: insurance.secondInsuranceForm.secondInsuranceFiles,
      };
      if (
        this.submitEnrolService.enrollmentFormPayload.DrugGroup === 'Jemperli'
      ) {
        medicalPlansData.push(medicalPlanSecondData);
      } else {
        pharmacyPlansData.push(medicalPlanSecondData);
      }
    }

    if (
      this.submitEnrolService.enrollmentFormPayload.DrugGroup === 'Jemperli'
    ) {
      this.submitEnrolService.enrollmentFormPayload.Insurance = {
        MedicalInsurance: insurance.firstInsuranceForm.coverageType.length
          ? 'Y'
          : 'N',
        PharmacyInsurance: insurance.secondInsuranceForm.coverageType.length
          ? 'Y'
          : 'N',
        MedicalPlans: medicalPlansData,
        PharmacyPlans: pharmacyPlansData,
      };
    } else {
      this.submitEnrolService.enrollmentFormPayload.Insurance = {
        MedicalInsurance: insurance.firstInsuranceForm.coverageType.length
          ? 'Y'
          : 'N',
        PharmacyInsurance: insurance.secondInsuranceForm.coverageType.length
          ? 'Y'
          : 'N',
        MedicalPlans: medicalPlansData,
        PharmacyPlans: pharmacyPlansData,
      };
    }
    // if priorAuth and appeal comes set these to Patient Data here??
  }

  ngOnDestroy(): void {
    this.enrolService.submitFormInitiated.next(false);
    this.submitEnrolService.selectedPrescriberId.next(0);
    this.submitEnrolService.resetForms();
  }
}
