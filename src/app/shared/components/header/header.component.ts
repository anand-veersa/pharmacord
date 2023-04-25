import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName: string = '';
  public stepperLables: string[] = [
    'Services Requested',
    'Patient Information',
    'Prescriber Information',
    'Insurance Information',
    'Clinical Information',
    'Attestation and Signatures',
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.authService?.userFullName.subscribe(fullName => {
      if (!this.authService.isLoggedIn()) return;
      this.userName = fullName;
    });
  }

  logout(): void {
    this.sharedService.isLoading.next(true);
    this.authService.logout().subscribe(res => {
      this.sharedService.isLoading.next(false);
      this.router.navigate(['/logout']);
    });
  }
}
