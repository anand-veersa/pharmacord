import {
  Component,
  AfterViewChecked,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent implements AfterViewChecked {
  @Input() allSecurityQuestions: Array<{ label: string; value: number }>;
  @Input() selectedSecurityQuestions: Array<any>;

  public showSuccessMessage: boolean = false;
  public sameAnswersMsg: string = '';

  constructor(
    public profileService: ProfileService,
    private sharedService: SharedService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.profileService.createChangeSecurityQuesForm(
      this.allSecurityQuestions,
      this.selectedSecurityQuestions
    );
    this.cdref.detectChanges();
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
            this.sameAnswersMsg = res.Payload?.ErrorMessage;
            setTimeout(() => {
              this.showSuccessMessage = false;
              this.sameAnswersMsg = '';
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

  public changeSecurityQuestions(): void {
    this.profileService.filterQuestions(
      this.allSecurityQuestions,
      this.selectedSecurityQuestions
    );
  }
}
