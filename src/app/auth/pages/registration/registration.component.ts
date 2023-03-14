import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public lookupInformationFormData: JsonFormData;
  public lookupInformationForm: FormGroup;
  public confirmAccountInformationFormData: JsonFormData;
  public confirmAccountInformationForm: FormGroup;
  public createUsernameFormData: JsonFormData;
  public createUsernameForm: FormGroup;
  public accountTypeSelection: boolean = false;
  public prescriberRegistrationCard: boolean = true;
  public prescriberRegistration: boolean = true;
  public othersRegistrationCard: boolean = false;
  public othersRegistration: boolean = false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService
  ) {
    console.log('constructor of registration component');
  }

  ngOnInit() {
    console.log('oninit of registration compo');
    this.http
      .get('/assets/json/lookup-information-form.json')
      .subscribe((formData: any) => {
        this.lookupInformationFormData = formData;
        this.lookupInformationForm = this.sharedService.buildForm(
          this.lookupInformationFormData
        );
      });

    this.http
      .get('/assets/json/confirm-account-information-form.json')
      .subscribe((formData: any) => {
        this.confirmAccountInformationFormData = formData;
        this.confirmAccountInformationForm = this.sharedService.buildForm(
          this.confirmAccountInformationFormData
        );
      });

    this.http
      .get('/assets/json/create-username-password-form.json')
      .subscribe((formData: any) => {
        this.createUsernameFormData = formData;
        this.createUsernameForm = this.sharedService.buildForm(
          this.createUsernameFormData
        );
      });
  }

  toggleSelection() {
    this.othersRegistrationCard = !this.othersRegistrationCard;
    this.prescriberRegistrationCard = !this.othersRegistrationCard;
  }

  registrationStep1() {
    this.accountTypeSelection = false;
    if (this.prescriberRegistrationCard) {
      this.prescriberRegistration = true;
    } else {
      this.othersRegistration = true;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  checkProviderNpi() {
    console.log('checkProviderNpi function clicked');
  }
}
