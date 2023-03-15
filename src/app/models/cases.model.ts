export interface Patient {
  PatientId: string;
  CaseId: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Provider: string;
  DateSubmitted: string;
  EnrollmentStatus: string;
  Product: string;
  ActionNeeded: string;
}

export interface Case {
  PatientName: string;
  PatientId: string;
  CaseId: string;
  DateSubmitted: string;
  EnrollmentStatus: string;
  Product: string;
  ActionNeeded: string;
}

export interface Alert {
  GeneratedDate: string;
  RequiredAction: string;
  Acknowledge: string;
}
export interface CaseDoc {
  DocumentType: string;
  DocumentDate: string;
  DocumentURL: string;
}
