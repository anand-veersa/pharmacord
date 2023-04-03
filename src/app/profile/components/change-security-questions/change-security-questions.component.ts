import {
  Component,
  AfterContentChecked,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent implements AfterContentChecked {
  constructor(
    private router: Router,
    public profileService: ProfileService,
    private sharedService: SharedService,
    private cdref: ChangeDetectorRef
  ) {}

  showSuccessMessage: boolean = false;
  samePreviousAnswers: string = '';
  @Input() allSecurityQuestions: Array<{ label: string; value: number }>;
  @Input() selectedSecurityQuestions: Array<any>;

  ngAfterContentChecked() {
    this.profileService.createChangeSecurityQuesForm(
      this.allSecurityQuestions,
      this.selectedSecurityQuestions
    );
    this.cdref.detectChanges();
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
      .updateChangeSecurityQuestion(changeSecurityQuesPayload)
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

  public changeSecurityQuestions() {
    this.profileService.filterQuestions(
      this.allSecurityQuestions,
      this.selectedSecurityQuestions
    );
  }
}
