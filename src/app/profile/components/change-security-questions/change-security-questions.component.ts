import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  styleUrls: ['./change-security-questions.component.scss'],
})
export class ChangeSecurityQuestionsComponent {
  constructor(private router: Router) {}
  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
  }
}
