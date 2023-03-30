import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent implements OnInit {
  constructor(private router: Router, public profileService: ProfileService) {}

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
}
