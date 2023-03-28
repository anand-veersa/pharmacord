import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent implements OnInit {
  constructor(private router: Router, public profileService: ProfileService) {}
  ngOnInit() {
    this.profileService.createChangeSecurityQues();
  }

  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
  }
}
