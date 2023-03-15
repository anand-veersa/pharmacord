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
  public prescriberRegistration: boolean = false;
  public othersRegistrationCard: boolean = false;
  public othersRegistration: boolean = false;
  public addFacilityScreen: boolean = true;
  public addFacilityScreenTitle: string = 'Associated Practice Office(s)';
  public addFacilityScreenSubTitle: string =
    'Please add or update the Practice/Facility information associated with this new account.';
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

  toggleSelection(): void {
    this.othersRegistrationCard = !this.othersRegistrationCard;
    this.prescriberRegistrationCard = !this.othersRegistrationCard;
  }

  registrationStep1(): void {
    this.accountTypeSelection = false;
    if (this.prescriberRegistrationCard) {
      this.prescriberRegistration = true;
    } else {
      this.othersRegistration = true;
    }
  }

  registrationStep2(): void {
    if (this.prescriberRegistration) {
      this.prescriberRegistration = false;
      this.addFacilityScreen = true;
    } else {
      this.othersRegistration = false;
      this.addFacilityScreen = true;
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  checkProviderNpi(): void {
    console.log('checkProviderNpi function clicked');
  }
}
