import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-enrollment-form-header',
  templateUrl: './enrollment-form-header.component.html',
  styleUrls: ['./enrollment-form-header.component.scss'],
})
export class EnrollmentFormHeaderComponent {
  @Input() title: string = '';
}
