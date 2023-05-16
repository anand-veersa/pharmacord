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
    if (formName === 'select-prescription') {
      this.setPrescriptionDetails(form);
    }
    if (formName === 'attestation-details') {
      this.setAttestationDetails(form);
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

  private convertDate(str: string) {
    const date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return mnth + day + date.getFullYear();
  }

  private setPatientDetails(patient: any): void {
    console.log(patient, 'patient form data');
    const patientPhone = [];
    if (patient.homePhone)
      patientPhone.push({
        Type: 'Home',
        Number: patient.homePhone.replace(/\D/g, ''),
      });
    if (patient.cellPhone)
      patientPhone.push({
        Type: 'Mobile',
        Number: patient.cellPhone.replace(/\D/g, ''),
      });
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
    console.log(prescriber, 'prescriber form data');
    this.submitEnrolService.enrollmentFormPayload.Provider = {
      FirstName: this.submitEnrolService.selectedPrescriber.FirstName,
      LastName: this.submitEnrolService.selectedPrescriber.LastName,
      NPI: this.submitEnrolService.selectedPrescriber.NPI,
      TaxID: prescriber.prescriberDetailForm.taxId
        ? prescriber.prescriberDetailForm.taxId.replace(/\D/g, '')
        : null,
      Facility: {
        Id: this.submitEnrolService.selectedFacilityId,
        NPI: prescriber.prescriberDetailForm.facilityNpi,
        TaxId: prescriber.prescriberDetailForm.facilitytaxId
          ? prescriber.prescriberDetailForm.facilitytaxId.replace(/\D/g, '')
          : null,
        Name:
          this.submitEnrolService.selectedFacility[0].OfficeName ||
          this.submitEnrolService.selectedFacility[0].PracticeGroup,
        Address1: this.submitEnrolService.selectedFacility[0].Address.Line1,
        Address2: this.submitEnrolService.selectedFacility[0].Address.Line2,
        City: this.submitEnrolService.selectedFacility[0].Address.City,
        State: this.submitEnrolService.selectedFacility[0].Address.State,
        Zip: this.submitEnrolService.selectedFacility[0].Address.Zipcode,
        OfficeContactName: prescriber.prescriberDetailForm.officeContactName,
      },
      Phones: [
        {
          Number: this.submitEnrolService.selectedFacility[0].Phone,
          Ext: this.submitEnrolService.selectedFacility[0].Extension,
        },
      ],
      Fax: prescriber.prescriberDetailForm.fax.replace(/\D/g, '') ?? null,
      Email: prescriber.prescriberDetailForm.officeContactEmail,
      OtherFacilities: [
        {
          Name: prescriber.shippingDetailForm.shippingFacilityName,
          OfficeContactName: prescriber.shippingDetailForm.recipientName,
          Phone: prescriber.shippingDetailForm.phone.replace(/\D/g, ''),
          Address1: prescriber.shippingDetailForm.street,
          Address2: null,
          City: prescriber.shippingDetailForm.city,
          State: prescriber.shippingDetailForm.state,
          Zip: prescriber.shippingDetailForm.zipcode,
          FacilityType: prescriber.shippingDetailForm.siteOfAdministration,
        },
      ],
    };

    // set ship to Address that is in Prescription Object
    this.submitEnrolService.enrollmentFormPayload.PrescriptionInformation.ShipToAddress =
      {
        RecipientName: prescriber.shippingDetailForm.recipientName,
        Phone: prescriber.shippingDetailForm.phone.replace(/\D/g, ''),
        Address1: prescriber.shippingDetailForm.street,
        Address2: null,
        City: prescriber.shippingDetailForm.city,
        State: prescriber.shippingDetailForm.state,
        Zip: prescriber.shippingDetailForm.zipcode,
      };
  }

  private setInsuranceDetails(insurance: any): void {
    console.log(insurance, 'insurance form data');
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
        Phone: insurance.firstInsuranceForm.phone.replace(/\D/g, ''),
        PlanRank: 'Primary',
        PolicyID: insurance.firstInsuranceForm.policyId,
        SubscriberName: insurance.firstInsuranceForm.policyHolderName,
        SubscriberDOB: this.sharedService.getFormattedDate(
          insurance.firstInsuranceForm.policyHolderDob,
          true
        ),
        RelationshipToSubscriber:
          insurance.firstInsuranceForm.relationToPatient,
        GroupNo: insurance.firstInsuranceForm.group,
        AttachDoc: insurance.firstInsuranceForm.firstInsuranceFiles,
      };
      medicalPlansData.push(medicalPlanFirstData);
    }

    if (insurance.secondInsuranceForm.coverageType.length) {
      medicalPlanSecondData = {
        Type: insurance.secondInsuranceForm.coverageType,
        PolicyHolderEmployer: insurance.secondInsuranceForm.insurancePayer,
        PlanName: insurance.secondInsuranceForm.insuranceName,
        Phone: insurance.secondInsuranceForm.phone.replace(/\D/g, ''),
        PlanRank: 'Secondary',
        PolicyID: insurance.secondInsuranceForm.policyId,
        SubscriberName: insurance.secondInsuranceForm.policyHolderName,
        SubscriberDOB: this.sharedService.getFormattedDate(
          insurance.secondInsuranceForm.policyHolderDob,
          true
        ),
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

    // priorAuth form
    if (insurance.priorAuthForm.priorAuth1.length) {
      this.submitEnrolService.enrollmentFormPayload.Patient.PAInitiated =
        insurance.priorAuthForm.priorAuth1;
      if (insurance.priorAuthForm.paStatus1.length) {
        this.submitEnrolService.enrollmentFormPayload.Patient.PAStatus =
          insurance.priorAuthForm.paStatus1;
      }
    }

    // appeal form
    if (insurance.appealForm.priorAuth2.length) {
      this.submitEnrolService.enrollmentFormPayload.Patient.PAAppealInitiated =
        insurance.priorAuthForm.priorAuth2;
      if (insurance.priorAuthForm.paStatus2.length) {
        this.submitEnrolService.enrollmentFormPayload.Patient.PAAppealStatus =
          insurance.priorAuthForm.paStatus2;
      }
    }
  }

  private setPrescriptionDetails(prescription: any): void {
    console.log(prescription);
    // set clinical data
    const measurementsData: any[] = [
      {
        Name: 'BRCA',
        Result: prescription.currentLineOfTherapyForm.bRCATest,
      },
      {
        Name: 'HRd',
        Result: prescription.currentLineOfTherapyForm.hRDTest,
      },
    ];

    this.submitEnrolService.enrollmentFormPayload.Clinical = {
      TherapyStartDate: prescription.clinicalInfoForm.treatmentStartDate,
      Measurements: prescription.currentLineOfTherapyForm.bRCATest.length
        ? measurementsData
        : [],
      LastTreatmentDate: null,
    };

    // set prescription data
    let prescriptionData: any[] = [];

    if (
      this.submitEnrolService.enrollmentFormPayload.DrugGroup === 'Jemperli'
    ) {
      prescriptionData = [
        {
          Strength: prescription.prescriptionInfoForm.jemperliIVPres.strength,
          DirectionForAdministration: [
            [prescription.prescriptionInfoForm.jemperliIVPres.doa],
          ],
          Quantity: null,
        },
      ];
    } else if (
      this.submitEnrolService.enrollmentFormPayload.DrugGroup === 'Zejula'
    ) {
      //standard prescription
      if (prescription.prescriptionInfoForm.zejStd.length) {
        prescriptionData.push({
          Strength: prescription.prescriptionInfoForm.zejStd.strength,
          DirectionForAdministration: [
            prescription.prescriptionInfoForm.zejStd.doa,
          ],
          Quantity: prescription.prescriptionInfoForm.zejStd.qty,
          Medication: 'Standard Prescription',
        });
      }
      //quick start
      if (prescription.prescriptionInfoForm.zejQSP.length) {
        prescriptionData.push({
          Strength: prescription.prescriptionInfoForm.zejQSP.strength,
          DirectionForAdministration: [
            prescription.prescriptionInfoForm.zejQSP.doa,
          ],
          Quantity: prescription.prescriptionInfoForm.zejQSP.qty,
          Medication: 'Quick Start',
        });
      }
      //bridge program
      if (prescription.prescriptionInfoForm.zejBridge.length) {
        prescriptionData.push({
          Strength: prescription.prescriptionInfoForm.zejBridge.strength,
          DirectionForAdministration: [
            prescription.prescriptionInfoForm.zejBridge.doa,
          ],
          Quantity: prescription.prescriptionInfoForm.zejBridge.qty,
          Medication: 'Bridge Program',
        });
      }
    } else if (
      this.submitEnrolService.enrollmentFormPayload.DrugGroup === 'Ojjaara'
    ) {
      //standard
      if (prescription.prescriptionInfoForm.ojjaaraStd.length) {
        prescriptionData.push({
          Strength: prescription.prescriptionInfoForm.ojjaaraStd.strength,
          DirectionForAdministration: [
            prescription.prescriptionInfoForm.ojjaaraStd.doa,
          ],
          Quantity: prescription.prescriptionInfoForm.ojjaaraStd.qty,
          Medication: 'Standard Prescription',
        });
      }
      //Quick start
      if (prescription.prescriptionInfoForm.ojjaaraQSP.length) {
        prescriptionData.push({
          Strength: prescription.prescriptionInfoForm.ojjaaraQSP.strength,
          DirectionForAdministration: [
            prescription.prescriptionInfoForm.ojjaaraQSP.doa,
          ],
          Quantity: prescription.prescriptionInfoForm.ojjaaraQSP.qty,
          Medication: 'Quick Start',
        });
      }
      //Bridge program
      if (prescription.prescriptionInfoForm.ojjaaraBridge.length) {
        prescriptionData.push({
          Strength: prescription.prescriptionInfoForm.ojjaaraBridge.strength,
          DirectionForAdministration: [
            prescription.prescriptionInfoForm.ojjaaraBridge.doa,
          ],
          Quantity: prescription.prescriptionInfoForm.ojjaaraBridge.qty,
          Medication: 'Bridge Program',
        });
      }
    }

    //setting the data
    this.submitEnrolService.enrollmentFormPayload.PrescriptionInformation = {
      Prescriptions: prescriptionData,
      ProviderSignatureMapping:
        prescription.prescriptionInfoForm.prescriptionSignature,
      ShipToAddress:
        this.submitEnrolService.enrollmentFormPayload.PrescriptionInformation
          .ShipToAddress,
      ShipToType: {},
    };
  }

  private setAttestationDetails(attestation: any): void {
    console.log(attestation, 'attestation form data');
    // take a check for each property
    let attestationPayload: any = {};
    attestationPayload = {
      ...attestationPayload,
      IsPatientAttestationConsent: attestation.attestationConsent,
      PrescriberDeclaration: attestation.prescriberDeclaration
        ? 'True'
        : 'False',
    };

    // check prescriber signature option
    if (
      attestation.prescriberSignatureOptions ===
      'Prescriber will eSign the enrollment form'
    ) {
      attestationPayload = {
        ...attestationPayload,
        TextingOptIn: attestation.textingConsent,
        PAPEnrollment: attestation.patientAssistanceProgram,
        HIPPAAuthorization: attestation.hippaAuthorization,
      };

      if (
        this.submitEnrolService.enrollmentFormPayload.DrugGroup !== 'Jemperli'
      ) {
        attestationPayload = {
          ...attestationPayload,
          PSPEnrollment: attestation.patientSupportProgram,
        };
      }

      if (
        attestation.patientSignatureOptions ===
        'Patient will sign the enrollment form'
      ) {
        attestationPayload = {
          ...attestationPayload,
          PatientEmail: attestation.patientEmail,
        };
      } else {
        attestationPayload = {
          ...attestationPayload,
          PatientRepresentativeName: attestation.patientRepresentativeName,
          PatientRelationship: attestation.relationshipToPatient,
          PatientOrRepresentativeEmail: attestation.representativeEmail,
        };
      }
    }
    this.submitEnrolService.enrollmentFormPayload.Attestation =
      attestationPayload;
  }
  ngOnDestroy(): void {
    this.enrolService.submitFormInitiated.next(false);
    this.submitEnrolService.selectedPrescriberId.next(0);
    this.submitEnrolService.resetForms();
  }
}
