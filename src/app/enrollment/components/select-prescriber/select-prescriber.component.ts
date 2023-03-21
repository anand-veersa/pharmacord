import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {
  JsonFormControlOptions,
  JsonFormData,
} from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-select-prescriber',
  templateUrl: './select-prescriber.component.html',
  styleUrls: ['./select-prescriber.component.scss'],
})
export class SelectPrescriberComponent implements OnInit {
  @Input() selectedMedication: string;
  @Output() prescriberList = new EventEmitter();
  @Output() title = new EventEmitter();
  @Output() nextAction = new EventEmitter();
  @Output() selectPrescriberForm = new EventEmitter();
  @Output() prescriberListJson = new EventEmitter();

  constructor(
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.title.emit(`Submit ${this.selectedMedication} Enrollment Form`);
    const options: JsonFormControlOptions[] = [];
    const prescriberListJson: JsonFormData = { controls: [] };
    this.authService.user?.prescribers.forEach(prescriber => {
      options.push({
        label: `${prescriber.FirstName} ${prescriber.LastName}`,
        value: prescriber.ProviderId,
      });
      prescriberListJson.controls.push({
        name: 'Prescriber',
        value: '',
        label: '',
        placeholder: '',
        type: 'select',
        validators: { required: true },
        options: options,
      });
    });
    this.prescriberListJson.emit(prescriberListJson);
    this.selectPrescriberForm.emit(
      this.sharedService.buildForm(prescriberListJson)
    );
  }
}
