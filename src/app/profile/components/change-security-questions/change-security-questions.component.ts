import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent implements OnInit {
  @Input() selectedSecurityQuestions: Array<any>;
  @Input() setSecurityQuestionScreen: boolean;

  public allSecurityQuestions: Array<{ label: string; value: number }> = [];

  constructor(
    public profileService: ProfileService,
    private sharedService: SharedService,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileService.getSecurityQuestions().subscribe({
      next: (res: any) => {
        const response = res.Payload;
        let selectedOptions: number[] = [];
        let options: Array<{ label: string; value: number }> = [];

        response?.map((el: any) =>
          this.allSecurityQuestions.push({
            value: el.Id,
            label: el.QuestionText,
          })
        );

        if (this.localStorage.getItem('IsFirstTimeLogin')) {
          const [optns] = this.filterOptions([], true);
          options = optns;
        } else {
          const [optns, selectedVal] = this.filterOptions();
          options = optns;
          selectedOptions = selectedVal;
        }
        this.profileService.createChangeSecurityQuesForm(
          options,
          selectedOptions
        );
      },
      error: err => {
        this.sharedService.notify('error', err);
      },
    });
  }
  public setSecurityQuestions(): void {
    this.sharedService.isLoading.next(true);
    const form = this.profileService.changeSecurityQuesForm;
    const setSecurityQuesPayload = {
      CurrentPassword: form.get('currentPassword')?.value,
      SecurityAnswers: [
        {
          PortalAccountId: this.authService?.user?.portalAccountPkId,
          SecurityQuestion: { Id: form.get('question1')?.value },
          Choice: null,
          Answer: form.get('answer1')?.value,
        },
        {
          PortalAccountId: this.authService?.user?.portalAccountPkId,
          SecurityQuestion: { Id: form.get('question2')?.value },
          Choice: null,
          Answer: form.get('answer2')?.value,
        },
        {
          PortalAccountId: this.authService?.user?.portalAccountPkId,
          SecurityQuestion: { Id: form.get('question3')?.value },
          Choice: null,
          Answer: form.get('answer3')?.value,
        },
      ],
    };
    this.profileService
      .setFirstTimeSecurityQuestion(setSecurityQuesPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            this.sharedService.notify(
              'success',
              'Your Security Questions have been changed successfully.'
            );
            const userData = JSON.parse(this.localStorage.getItem('userData'));
            userData.IsFirstTimeLogin = false;
            userData.HasSecurityQuestionAnswered = true;
            this.localStorage.setItem('userData', JSON.stringify(userData));
            this.router.navigate(['/enrollment/dashboard']);
          }
          this.sharedService.isLoading.next(false);
        },
        error: (err: any) => {
          this.sharedService.isLoading.next(false);
          this.sharedService.notify('error', err);
        },
      });
  }

  public saveSecurityQuestions(): void {
    this.sharedService.isLoading.next(true);
    const form = this.profileService.changeSecurityQuesForm;

    const changeSecurityQuesPayload = {
      CurrentPassword: form.get('currentPassword')?.value,
      SecurityQuestion: [
        {
          Id: form.get('question1')?.value,
          Answer: form.get('answer1')?.value,
        },
        {
          Id: form.get('question2')?.value,
          Answer: form.get('answer2')?.value,
        },
        {
          Id: form.get('question3')?.value,
          Answer: form.get('answer3')?.value,
        },
      ],
    };
    this.profileService
      .updateChangeSecurityQuestion(changeSecurityQuesPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            const sameAnswersMsg = res.Payload?.ErrorMessage;
            this.sharedService.notify(
              'success',
              sameAnswersMsg ||
                'Your Security Questions have been changed successfully.'
            );
          }
          this.sharedService.isLoading.next(false);
        },
        error: (err: any) => {
          this.sharedService.isLoading.next(false);
          this.sharedService.notify('error', err);
        },
      });
  }

  public filterOptions(event?: any, firstTimeLogin?: boolean): any[] {
    let selectedQuestions: number[] = [];
    if (firstTimeLogin) {
      return [
        this.allSecurityQuestions,
        this.allSecurityQuestions,
        this.allSecurityQuestions,
      ];
    } else if (this.selectedSecurityQuestions && !event) {
      selectedQuestions = this.selectedSecurityQuestions.map(
        el => el.SecurityQuestion.Id
      );
    } else {
      //Runs of every change in dropdown
      if (this.profileService.changeSecurityQuesForm) {
        const question1 =
          this.profileService.changeSecurityQuesForm?.get('question1')?.value;
        const question2 =
          this.profileService.changeSecurityQuesForm?.get('question2')?.value;
        const question3 =
          this.profileService.changeSecurityQuesForm?.get('question3')?.value;
        selectedQuestions = [question1, question2, question3];
      }
    }
    //Filtering if already selected
    const q1 = this.allSecurityQuestions.filter(
      e => e.value !== selectedQuestions[1] && e.value !== selectedQuestions[2]
    );
    const q2 = this.allSecurityQuestions.filter(
      e => e.value !== selectedQuestions[0] && e.value !== selectedQuestions[2]
    );
    const q3 = this.allSecurityQuestions.filter(
      e => e.value !== selectedQuestions[0] && e.value !== selectedQuestions[1]
    );

    this.profileService.changeSecurityQuesJSON?.controls.forEach(data => {
      if (data.type === 'select') {
        if (data.name === 'question1') data.options = q1;
        else if (data.name === 'question2') data.options = q2;
        else if (data.name === 'question3') data.options = q3;
      }
    });
    return [[q1, q2, q3], selectedQuestions];
  }
}
