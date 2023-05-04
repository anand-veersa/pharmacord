import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { EnrollmentService } from '../../enrollment.service';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss'],
})
export class SelectPatientComponent implements OnInit {
  @Input() selectedMedication: string;
  @Output() title = new EventEmitter();
  @Output() action = new EventEmitter();
  public patientType: string = 'new';
  public patients: any[];

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private enrolService: EnrollmentService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.submitEnrolService.createSelectPatientForm();
    this.enrolService.medicineCases.subscribe((data: any[]) => {
      this.patients = this.sharedService.getPatients(data);
    });
  }

  public changePatientType(type: string): void {
    this.patientType = type;
    this.submitEnrolService.patientDetails.controls.forEach(
      (control: JsonFormControls) => {
        if (
          control.name === 'selectName' ||
          control.name === 'firstName' ||
          control.name === 'lastName'
        ) {
          control.display = !control.display;
        }
        if (control.name === 'sex' || control.name === 'dob') {
          control.disabled = !control.disabled;
        }
      }
    );
  }

  public changePatient(patientData: any): void {
    const patient = this.submitEnrolService.getPatientDetails(
      patientData.patientId,
      patientData.caseId
    );
    this.submitEnrolService.patientDetailForm.controls['sex'].setValue(
      patient.Gender
    );
    this.submitEnrolService.patientDetailForm.controls['dob'].setValue(
      new Date(patient.DateOfBirth)
    );
  }

  public onAction(actionType: string): void {
    this.action.emit({
      actionType,
      formName: 'select-patient',
      form: {
        ...this.submitEnrolService.patientDetailForm.value,
        ...this.submitEnrolService.patientRepDetailForm.value,
        ...this.submitEnrolService.patientRepDetailForm.value,
      },
      nextScreen:
        actionType === 'back' ? 'select-services' : 'prescriber-details',
    });
  }

  public checkFormValidity(): boolean {
    return (
      this.submitEnrolService.patientDetailForm.invalid ||
      this.submitEnrolService.patientRepDetailForm.invalid ||
      (this.submitEnrolService.patientRepDetailForm.controls['applyPap']
        .value === 'Y' &&
        this.submitEnrolService.patientPapDetailForm.invalid)
    );
  }
}
