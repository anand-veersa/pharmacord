import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/constants/app.constants';
import { EnrollmentService } from '../../enrollment.service';

@Component({
  selector: 'app-tools-and-forms',
  templateUrl: './tools-and-forms.component.html',
  styleUrls: ['./tools-and-forms.component.scss'],
})
export class ToolsAndFormsComponent implements OnInit {
  public selectedMedicine: string;
  public medicines: string[];
  public toolsAndFormsData: any[];
  constructor(
    public appConstants: AppConstants,
    private enrollService: EnrollmentService
  ) {
    this.medicines = Object.values(this.appConstants.MEDICINES);
  }

  ngOnInit() {
    this.enrollService.selectedMedicine.subscribe(selectedMed => {
      console.log('herec');
      this.toolsAndFormsData = [];
      this.selectedMedicine = selectedMed;
      if (this.selectedMedicine === this.appConstants.MEDICINES.ALL) {
        Object.values(this.appConstants.MEDICINES).map(med => {
          if (med === this.appConstants.MEDICINES.ALL) return;
          this.toolsAndFormsData.push({
            medicine: med,
            enrollmentForm: `/assets/docs/${med}_enrollment_form`,
          });
        });
      } else {
        this.toolsAndFormsData.push({
          medicine: this.selectedMedicine,
          enrollmentForm: `/assets/docs/${this.selectedMedicine}_enrollment_form`,
        });
      }
    });
  }
}
