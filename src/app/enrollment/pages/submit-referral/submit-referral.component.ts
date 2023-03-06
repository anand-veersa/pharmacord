import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit-referral',
  templateUrl: './submit-referral.component.html',
  styleUrls: ['./submit-referral.component.scss'],
})
export class SubmitReferralComponent {
  @Input() cases: any[] = [];
}
