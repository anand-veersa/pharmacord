import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public prescriberRegistration: boolean = true;
  public HcpRegistration: boolean = false;
  constructor(private router: Router) {
    console.log('constructor of registration component');
  }

  ngOnInit() {
    console.log('oninit of registration compo');
  }

  toggleSelection() {
    this.HcpRegistration = !this.HcpRegistration;
    this.prescriberRegistration = !this.prescriberRegistration;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
