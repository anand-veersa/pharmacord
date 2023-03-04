import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public userName: string = '';

  constructor(
    public authService: AuthService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.userName = JSON.parse(this.localStorage.getItem('userData')).UserName;
  }
}
