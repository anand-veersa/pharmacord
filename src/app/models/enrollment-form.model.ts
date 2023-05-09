interface FinancialData {
  HouseholdGrossAnnualIncome: string;
  NumberOfMembersInHousehold: string;
}

interface MedicalPlanData {
  Type: string;
  PolicyHolderEmployer: string;
  PlanName: string;
  Phone: string;
  PlanRank: string;
  PolicyID: string;
  SubscriberName: string;
  SubscriberDOB: string;
  RelationshipToSubscriber: string;
  GroupNo: string;
  AttachDoc: { file: string }[];
}

interface InsuranceData {
  MBI?: string;
  MedicalInsurance: string;
  PharmacyInsurance: string;
  MedicalPlans: MedicalPlanData[];
  PharmacyPlans?: MedicalPlanData[];
}

interface PrescriptionInformationData {
  Quantity: string | null;
  Strength: string;
  DirectionForAdministration: string[];
}

export interface FacilityData {
  Id: number | null;
  NPI: string;
  TaxId: string;
  Name: string;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  Zip: string;
  OfficeContactName: string;
}

interface OtherFacilityData {
  Name: string;
  OfficeContactName: string;
  Phone: string;
  Address1: string;
  Address2: string | null;
  City: string;
  State: string;
  Zip: string;
  FacilityType: string;
}

interface PrescriberData {
  FirstName: string;
  LastName: string;
  NPI: string;
  TaxID: string;
  Facility: FacilityData;
  Phones: { Number: string; Ext: string }[];
  Fax: string;
  Email: string;
  OtherFacilities: OtherFacilityData[];
}

interface AttestaionData {
  IsPatientAttestationConsent: boolean;
  PrescriberDeclaration: boolean;
  TextingOptIn: boolean;
  PAPEnrollment: boolean;
  HIPPAAuthorization: boolean;
  PSPEnrollment: boolean;
  PatientEmail: string;
}

interface AlternateContactData {
  FirstName: string;
  LastName: string;
  RelationshipToPatient: string;
  Phone: string;
}

interface PhoneData {
  Type: string;
  Number: string;
}

interface PatientData {
  FirstName?: string;
  LastName: string;
  DOB: string;
  Gender: string;
  MMRStatus: string[];
  DiagnosisCodes: string[];
  OtherDiagnosisCodes: string;
  PriorTherapies: string[];
  OtherPriorTherapies: string[];
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  Zip: string;
  PatientEmailAddress: string;
  PatientId: null;
  Phones: PhoneData[];
  AlternateContact: AlternateContactData;
  BestContactTime: string;
}

export interface EnrollmentFormPayload {
  ExtRefId: string;
  PopulatePdfFlag: boolean;
  DrugGroup: string;
  EnrollmentServiceRequests: {
    Id: string;
    Name: string;
  }[];
  PreferredSpecialityPharmacy: {
    Id: string;
    Name: string;
  }[];
  Patient: PatientData;
  Financial: FinancialData;
  Insurance: InsuranceData;
  PrescriptionInformation: PrescriptionInformationData;
  Provider: PrescriberData;
  Attestation: AttestaionData;
}

export interface EnrollmentScreenNextData {
  actionType: string;
  formName: string;
  form: any;
  nextScreen: string;
}

export interface PrescriberFacility {
  FacilityId: number;
  FacilityName: string;
  Address: string;
  Phone: string;
  Fax: string;
  Email: string;
}
