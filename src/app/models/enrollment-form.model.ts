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
  Medication?: string;
  Refills?: string;
}

interface ShipToAddressData {
  RecipientName: string;
  Phone: string;
  Address1: string;
  Address2: string | null;
  City: string;
  State: string;
  Zip: string;
}
interface PrescriptionData {
  Prescriptions: PrescriptionInformationData[];
  ProviderSignatureMapping: string;
  ShipToAddress: ShipToAddressData;
  ShipToType: object;
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
  PrescriberDeclaration: string;
  TextingOptIn?: boolean;
  PAPEnrollment?: boolean;
  HIPPAAuthorization?: boolean;
  PSPEnrollment?: boolean;
  PatientEmail?: string;
  PatientRepresentativeName?: string;
  PatientRelationship?: string;
  PatientOrRepresentativeEmail?: string;
  PatientOrRepresentativePhone?: string;
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
  PAInitiated?: string;
  PAStatus?: string;
  PAAppealInitiated?: string;
  PAAppealStatus?: string;
}

interface MeasurementsData {
  Name: string;
  Result: string;
}
interface ClinicalData {
  TherapyStartDate: string;
  Measurements: MeasurementsData[];
  LastTreatmentDate: string | null;
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
  Clinical: ClinicalData;
  Patient: PatientData;
  Financial: FinancialData;
  Insurance: InsuranceData;
  PrescriptionInformation: PrescriptionData;
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
