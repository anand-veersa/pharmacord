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
  public tabClicked: number = 0;
  public allSecurityQuestions: Array<{ label: string; value: number }>;
  public selectedSecurityQuestions: Array<any>;
  private securityQuestions: any[];

  constructor(
    private enrolService: EnrollmentService,
    private localStorage: LocalStorageService,
    private sharedService: SharedService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.sharedService.isLoading.next(true);
    this.enrolService
      .getAccountInfo(
        JSON.parse(this.localStorage.getItem('userData'))?.UserName
      )
      .subscribe({
        next: (res: any) => {
          this.profileService
            .getSecurityQuestionsbyId(res.Payload?.PortalAccountPkId)
            .subscribe({
              next: (seqQues: any) => {
                this.selectedSecurityQuestions = seqQues.Payload;
                this.sharedService.isLoading.next(false);
              },
              error: err => {
                this.sharedService.notify('error', err);
                this.sharedService.isLoading.next(false);
              },
            });
        },
        error: err => {
          this.sharedService.notify('error', err);
          this.sharedService.isLoading.next(false);
        },
      });

    this.profileService.getSecurityQuestions().subscribe({
      next: (res: any) => {
        this.securityQuestions = res.Payload;
        const arr: Array<{ label: string; value: number }> = [];
        this.securityQuestions.map(el =>
          arr.push({ value: el.Id, label: el.QuestionText })
        );
        this.allSecurityQuestions = arr;
      },
      error: err => {
        this.sharedService.notify('error', err);
      },
    });
  }

  public tabChange(tabClicked: number) {
    this.tabClicked = tabClicked;
  }

  ngOnDestroy(): void {
    this.profileService.resetForms();
  }
}
