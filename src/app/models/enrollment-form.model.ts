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
  MBI: string;
  MedicalInsurance: string;
  PharmacyInsurance: string;
  MedicalPlans: MedicalPlanData[];
}

interface PrescriptionInformationData {
  Quantity: string;
  Strength: string;
  DirectionForAdministration: string[];
}

interface FacilityData {
  Id: number;
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
  Address2: string;
  City: string;
  State: string;
  Zip: string;
  FacilityType: string;
}

interface ProviderData {
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
  IsPatientAttestationConsent: string;
  PrescriberDeclaration: string;
  TextingOptIn: string;
  PAPEnrollment: string;
  HIPPAAuthorization: string;
  PSPEnrollment: string;
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
  FirstName: string;
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
  ExtRefId?: string;
  PopulatePdfFlag?: boolean;
  DrugGroup?: string;
  EnrollmentServiceRequests?: {
    Id: string;
    Name: string;
  };
  Patient?: PatientData;
  Financial?: FinancialData;
  Insurance?: InsuranceData;
  PrescriptionInformation?: PrescriptionInformationData;
  Provider?: ProviderData;
  Attestation?: AttestaionData;
}

export interface EnrollmentScreenNextData {
  formName: string;
  form: any;
  nextScreen: string;
}
