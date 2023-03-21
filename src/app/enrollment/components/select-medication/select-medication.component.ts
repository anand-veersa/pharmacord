import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/constants/app.constants';
import {
  JsonFormControlOptions,
  JsonFormData,
} from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-select-medication',
  templateUrl: './select-medication.component.html',
  styleUrls: ['./select-medication.component.scss'],
})
export class SelectMedicationComponent implements OnInit {
  public medications: string[] = [];
  public formJson: JsonFormData = { controls: [] };
  public selectMedicationForm: FormGroup;
  @Output() title = new EventEmitter();
  @Output() nextAction = new EventEmitter();

  constructor(
    private appConstants: AppConstants,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.title.emit('Medication For Patient Enrollment');
    const options: JsonFormControlOptions[] = [];
    Object.values(this.appConstants.MEDICINES).forEach(medicine => {
      if (medicine === this.appConstants.MEDICINES.ALL) return;
      const formattedMed = this.sharedService.capitalize(medicine);
      options.push({ label: formattedMed, value: formattedMed });
      this.formJson.controls.push({
        name: 'DrugGroup',
        value: '',
        label: '',
        placeholder: '',
        type: 'radio',
        validators: { required: true },
        options: options,
      });
    });
    this.selectMedicationForm = this.sharedService.buildForm(this.formJson);
  }

  public action(actionType: string): void {
    if (actionType === 'back') this.router.navigate(['/enrollment/dashboard']);
    else {
      this.nextAction.emit({
        formName: 'select-medication',
        form: this.selectMedicationForm.value,
        nextScreen: 'select-prescriber',
      });
    }
  }
}
