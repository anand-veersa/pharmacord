import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
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
  public othersCreateUsernameFormData: JsonFormData;
  public othersCreateUsernameForm: FormGroup;
  public othersAccountInformationFormData: JsonFormData;
  public othersAccountInformationForm: FormGroup;
  public accountTypeSelection: boolean = true;
  public prescriberRegistrationCard: boolean = true;
  public prescriberRegistration: boolean = false;
  public othersRegistrationCard: boolean = false;
  public othersRegistration: boolean = false;
  public prescriberAddFacilityScreen: boolean = false;
  public othersAddFacilityScreen: boolean = false;
  public addHealthcareProviderScreen: boolean = false;
  public thankYouScreen: boolean = false;
  public addFacilityScreenTitle: string = 'Associated Practice Office(s)';
  public addFacilityScreenSubTitle: string =
    'Please add or update the Practice/Facility information associated with this new account.';
  public addProviderScreenTitle = 'Associated Healthcare Provider(s)';
  public addProviderScreenSubTitle =
    'Please enter the information for each healthcare provider (HCP) associated with this new account.';
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

    this.http
      .get('/assets/json/confirm-account-information-form.json')
      .subscribe((formData: any) => {
        this.othersAccountInformationFormData = formData;
        this.othersAccountInformationForm = this.sharedService.buildForm(
          this.othersAccountInformationFormData
        );
      });

    this.http
      .get('/assets/json/create-username-password-form.json')
      .subscribe((formData: any) => {
        this.othersCreateUsernameFormData = formData;
        this.othersCreateUsernameForm = this.sharedService.buildForm(
          this.othersCreateUsernameFormData
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
      this.prescriberAddFacilityScreen = true;
    } else {
      this.othersRegistration = false;
      this.othersAddFacilityScreen = true;
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  checkProviderNpi(): void {
    console.log('checkProviderNpi function clicked');
  }

  backTriggeredFromStep2(eventData: { backBtnClicked: boolean }): void {
    console.log('backBtnClicked value in ', eventData.backBtnClicked);
    this.prescriberAddFacilityScreen = false;
    if (this.prescriberRegistrationCard) {
      this.prescriberRegistration = true;
    } else {
      this.othersRegistration = true;
    }
  }

  moveToOthersFirstScreen(eventData: { backBtnClicked: boolean }): void {
    console.log('moveToOthersFirstScreen triggered');
    this.othersAddFacilityScreen = false;
    this.othersRegistration = true;
  }

  moveToAddProviderScreen(eventData: { nextBtnClicked: boolean }): void {
    console.log('i am in moveToAddProviderScreen ', eventData.nextBtnClicked);
    this.othersAddFacilityScreen = false;
    this.addHealthcareProviderScreen = true;
  }

  navigateToSelectAccountType(): void {
    this.othersRegistration = false;
    this.prescriberRegistration = false;
    this.accountTypeSelection = true;
  }

  saveAndRegisterCall(eventData: { healthcareProviders: any }): void {
    console.log(eventData.healthcareProviders, 'data from add provider screen');
    if (this.addHealthcareProviderScreen == true) {
      // API call for registration will be handle here
      this.addHealthcareProviderScreen = false;
      this.thankYouScreen = true;
    } else {
      // API call for registration will be handle here
      this.prescriberAddFacilityScreen = false;
      this.thankYouScreen = true;
    }
  }
}
