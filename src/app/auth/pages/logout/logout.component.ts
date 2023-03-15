import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    this.localStorage.clear();
  }

  public reLogin(): void {
    this.router.navigate(['/login']);
  }
}
