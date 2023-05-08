import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-services',
  templateUrl: './select-services.component.html',
  styleUrls: ['./select-services.component.scss'],
})
export class SelectServicesComponent implements OnChanges {
  @Input() selectedMedication: string;
  @Output() title = new EventEmitter();
  @Output() action = new EventEmitter();
  // public checkedServices: any[] = [];

  constructor(public submitEnrolService: SubmitEnrollmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.submitEnrolService.servicesForm);
    if (this.submitEnrolService.filteredServices.controls.length > 0) return;
    this.submitEnrolService.createSelectServicesForm(
      this.submitEnrolService.enrollmentFormPayload.DrugGroup
    );
    if (this.selectedMedication !== 'Jemperli')
      this.submitEnrolService.createSelectPharmacyForm(
        this.submitEnrolService.enrollmentFormPayload.DrugGroup
      );
  }

  public checkFormValidity(): boolean {
    if (
      this.submitEnrolService.servicesForm &&
      this.selectedMedication !== 'Jemperli'
    ) {
      return Object.values(this.submitEnrolService.servicesForm.value).filter(
        service => service
      ).length > 0
        ? false
        : true;
    }
    return false;
  }

  public onAction(actionType: string): void {
    const actionObj = {
      actionType,
      formName: 'select-services',
      form: {
        services: this.submitEnrolService.servicesForm.value,
        pharmacy: this.submitEnrolService.specialityPharmacyForm?.value
          ? [this.submitEnrolService.specialityPharmacyForm?.value]
          : [],
      },
      nextScreen:
        actionType === 'back' ? 'select-prescriber' : 'select-patient',
    };
    this.action.emit(actionObj);
  }
}
