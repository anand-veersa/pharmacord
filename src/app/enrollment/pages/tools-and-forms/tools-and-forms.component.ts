import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/constants/app.constants';
import { SharedService } from 'src/app/shared/services/shared.service';
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
  public pdfSrc: string;
  public pdfPage: number = 1;
  public downloadFileName: string;
  constructor(
    public appConstants: AppConstants,
    private enrollService: EnrollmentService,
    private sharedService: SharedService
  ) {
    this.medicines = Object.values(this.appConstants.MEDICINES);
  }

  ngOnInit() {
    this.enrollService.selectedMedicine.subscribe(selectedMed => {
      this.toolsAndFormsData = [];
      this.selectedMedicine = selectedMed;
      if (this.selectedMedicine === this.appConstants.MEDICINES.ALL) {
        Object.values(this.appConstants.MEDICINES).map(med => {
          if (med === this.appConstants.MEDICINES.ALL) return;
          this.toolsAndFormsData.push({
            medicine: med,
            enrollmentForm: `${med}_Enrollment_Form`,
            sampleLetterOfAppeal: `${med}_LOA`,
            sampleLetterOfMedicalNecessity: `${med}_LOMN`,
          });
        });
      } else {
        this.toolsAndFormsData.push({
          medicine: this.selectedMedicine,
          enrollmentForm: `${this.selectedMedicine}_Enrollment_Form`,
          sampleLetterOfAppeal: `${this.selectedMedicine}_LOA`,
          sampleLetterOfMedicalNecessity: `${this.selectedMedicine}_LOMN`,
        });
      }
    });
  }
  showPdf(fileName: string, page: number = 1, downloadName: string) {
    this.pdfSrc = `/assets/docs/${fileName}.pdf`;
    this.pdfPage = page;
    this.downloadFileName = downloadName;
  }

  closePdf() {
    this.pdfSrc = '';
    this.pdfPage = 1;
  }

  downloadFile(): void {
    this.sharedService.downloadFile(this.pdfSrc, this.downloadFileName);
  }
}
