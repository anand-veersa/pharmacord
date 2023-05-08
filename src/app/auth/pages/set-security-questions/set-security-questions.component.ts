import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.component.html',
  styleUrls: ['./set-security-questions.component.scss'],
})
export class SetSecurityQuestionsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  public setSecurityQuestionScreen: boolean = false;

  ngOnInit() {
    if (this.route.snapshot.routeConfig?.path === 'security-questions') {
      this.setSecurityQuestionScreen = true;
    }
  }
  ngOnDestroy() {
    this.setSecurityQuestionScreen = false;
    this.profileService.changeSecurityQuesForm.reset();
  }
}
