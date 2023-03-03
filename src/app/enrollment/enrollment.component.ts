import { Component } from '@angular/core';
import { EnrollmentService } from './enrollment.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
})
export class EnrollmentComponent {
  public currentDate = new Date();
  public selectedMed: string = 'Jemperli';

  constructor(private enrolService: EnrollmentService) {}

  public changeMedicine(medicine: string) {
    this.selectedMed = medicine;
    this.enrolService.selectedMedicine.next(medicine);
  }
}
