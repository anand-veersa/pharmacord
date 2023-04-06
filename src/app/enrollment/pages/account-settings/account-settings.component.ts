import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  @Input() cases: any[] = [];
  public facilityTabTitle = 'Manage Practice Office(s)';
  public facilityTabSubTitle =
    'Please add or update the Practice/Facility information associated with this account.';
}
