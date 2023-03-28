import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { SharedService } from '../shared/services/shared.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private enrolService: EnrollmentService,
    private localStorage: LocalStorageService,
    private sharedService: SharedService,
    private profileService: ProfileService
  ) {}

  tabClicked: string = 'password';
  ngOnInit() {
    this.sharedService.isLoading.next(true);

    this.enrolService
      .getAccountInfo(
        JSON.parse(this.localStorage.getItem('userData')).UserName
      )
      .subscribe({
        next: (res: any) => {
          this.sharedService.isLoading.next(false);
        },
        error: err => {
          this.sharedService.notify('error', err, '');
          this.sharedService.isLoading.next(false);
        },
      });
  }

  public tabChange(tab: number) {
    if (tab === 0) this.tabClicked = 'password';
    else if (tab === 1) this.tabClicked = 'security';
    else if (tab === 2) this.tabClicked = 'profile';
  }

  ngOnDestroy(): void {
    this.profileService.resetForms();
  }
}
