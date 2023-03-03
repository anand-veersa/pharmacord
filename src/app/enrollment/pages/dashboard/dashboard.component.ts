import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../enrollment.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public cases: any[] = [];
  public pendingCases: any[] = [];
  constructor(private enrolService: EnrollmentService) {}
  ngOnInit() {
    this.enrolService.medicineCases.subscribe((data: any[]) => {
      this.cases = data;
      this.pendingCases = this.cases.filter(c => c.ActionNeeded);
    });
  }
}
