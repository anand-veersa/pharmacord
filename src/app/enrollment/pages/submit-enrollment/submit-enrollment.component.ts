import { Component, Input, OnDestroy } from '@angular/core';
import { EnrollmentService } from '../../enrollment.service';

@Component({
  selector: 'app-submit-enrollment',
  templateUrl: './submit-enrollment.component.html',
  styleUrls: ['./submit-enrollment.component.scss'],
})
export class SubmitEnrollmentComponent implements OnDestroy {
  @Input() cases: any[] = [];
  public title: string = '';

  constructor(private enrolService: EnrollmentService) {}

  public setTitle(title: string): void {
    this.title = title;
  }

  ngOnDestroy(): void {
    this.enrolService.submitFormInitiated.next(false);
  }
}
