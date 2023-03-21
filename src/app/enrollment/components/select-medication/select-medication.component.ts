import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppConstants } from 'src/app/constants/app.constants';
import { JsonFormData } from 'src/app/models/json-form-data.model';
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
  constructor(
    private appConstants: AppConstants,
    private http: HttpClient,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.title.emit('Medication For Patient Enrollment');
    const options: any[] = [];
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
}
