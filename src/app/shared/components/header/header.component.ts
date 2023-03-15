import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName: string = '';

  constructor(
    private router: Router,
    public authService: AuthService,
    public sharedService: SharedService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) return;
    this.userName = JSON.parse(this.localStorage.getItem('userData')).UserName;
  }

  logout(): void {
    this.sharedService.isLoading.next(true);
    this.authService.logout().subscribe(res => {
      this.sharedService.isLoading.next(false);
      this.router.navigate(['/logout']);
    });
  }
}
