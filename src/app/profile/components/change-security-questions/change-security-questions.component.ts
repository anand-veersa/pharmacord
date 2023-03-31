import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent implements OnInit {
  constructor(
    private router: Router,
    public profileService: ProfileService,
    private sharedService: SharedService
  ) {}

  showSuccessMessage: boolean = false;
  samePreviousAnswers: string = '';
  @Input() securityQuesOptions: Array<{ label: string; value: number }>;
  @Input() defaultSecurityQuestions: Array<any>;

  ngOnInit() {
    this.profileService.createChangeSecurityQues(
      this.securityQuesOptions,
      this.defaultSecurityQuestions
    );
  }

  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
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
      .changeSecurityQuestion(changeSecurityQuesPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            this.showSuccessMessage = true;
            this.samePreviousAnswers = res.Payload?.ErrorMessage;
            setTimeout(() => {
              this.showSuccessMessage = false;
              this.samePreviousAnswers = '';
            }, 5000);
          }
          this.sharedService.isLoading.next(false);
        },
        error: (err: any) => {
          this.sharedService.isLoading.next(false);
          this.sharedService.notify('error', err);
        },
      });
  }
}
