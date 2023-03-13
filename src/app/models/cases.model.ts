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
  CaseId: string;
  DateSubmitted: string;
  EnrollmentStatus: string;
  Product: string;
  ActionNeeded: string;
}
