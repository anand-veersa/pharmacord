import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';

@Component({
  selector: 'app-select-medication',
  templateUrl: './select-medication.component.html',
  styleUrls: ['./select-medication.component.scss'],
})
export class SelectMedicationComponent implements OnInit {
  @Output() action = new EventEmitter();
  public medications: string[] = [];
  public formJson: JsonFormData = { controls: [] };
  public selectMedicationForm: FormGroup;

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submitEnrolService.headerTitle.next(
      'Medication For Patient Enrollment'
    );
    // const options: JsonFormControlOptions[] = [];
    // Object.values(this.appConstants.MEDICINES).forEach(medicine => {
    //   if (medicine === this.appConstants.MEDICINES.ALL) return;
    //   const formattedMed = this.sharedService.capitalize(medicine);
    //   options.push({ label: formattedMed, value: formattedMed });
    //   this.formJson.controls.push({
    //     name: 'DrugGroup',
    //     value: '',
    //     label: '',
    //     placeholder: '',
    //     type: 'radio',
    //     validators: { required: true },
    //     options: options,
    //   });
    // });
    this.submitEnrolService.createSelectMedicationForm();
    // this.selectMedicationForm = getSelectMedicationForm;
    // this.formJson = medicationJson;
    // this.selectMedicationForm.controls['DrugGroup'].setValue(this.selectedMedication);
  }

  public onAction(actionType: string): void {
    if (actionType === 'back') this.router.navigate(['/enrollment/dashboard']);
    else {
      this.action.emit({
        actionType,
        formName: 'select-medication',
        form: this.submitEnrolService.medicationForm.value,
        nextScreen: 'select-insurance',
      });
    }
  }
}
