import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sharedService.isLoading.next(true);
    this.authService.logout().subscribe({
      next: res => {
        this.sharedService.isLoading.next(false);
        this.localStorage.clear();
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.localStorage.clear();
      },
    });
  }

  public reLogin(): void {
    this.router.navigate(['/login']);
  }
}
