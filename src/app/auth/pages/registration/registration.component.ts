import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../auth.service';

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
  public accountTypeSelection: boolean = true; // account selection screen
  public prescriberRegistrationCard: boolean = true;
  public prescriberRegistration: boolean = false;
  public othersRegistrationCard: boolean = false;
  public othersRegistration: boolean = false;
  public validPrescriberNPI: boolean = false;
  public findPrescriberBtnClicked: boolean = false;
  public prescriberAddFacilityScreen: boolean = false; // add facility by prescriber
  public othersAddFacilityScreen: boolean = false; // add facility by others
  public addHealthcareProviderScreen: boolean = false; //add Provider scrren
  public thankYouScreen: boolean = false;
  public invalidUsernameError: string = 'Invalid username';
  public invalidUsername: boolean = true;
  public addFacilityScreenTitle: string = 'Associated Practice Office(s)';
  public addFacilityScreenSubTitle: string =
    'Please add or update the Practice/Facility information associated with this new account.';
  public addProviderScreenTitle = 'Associated Healthcare Provider(s)';
  public addProviderScreenSubTitle =
    'Please enter the information for each healthcare provider (HCP) associated with this new account.';
  public prescriberID: number;
  public facilities: Array<object> = [];
  public UserContactDetails: Array<object> = [];
  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService,
    private authService: AuthService
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
      this.UserContactDetails.push({
        FirstName:
          this.confirmAccountInformationForm.controls['confirmAccountFirstName']
            .value,
        LastName:
          this.confirmAccountInformationForm.controls['confirmAccountLastName']
            .value,
        Phone:
          this.confirmAccountInformationForm.controls['confirmAccountPhone']
            .value,
        Fax: this.confirmAccountInformationForm.controls['confirmAccountFax']
          .value,
        Email:
          this.confirmAccountInformationForm.controls['confirmAccountEmail']
            .value,
      });
    } else {
      this.othersRegistration = false;
      this.othersAddFacilityScreen = true;
      this.UserContactDetails.push({
        FirstName:
          this.othersAccountInformationForm.controls['confirmAccountFirstName']
            .value,
        LastName:
          this.othersAccountInformationForm.controls['confirmAccountLastName']
            .value,
        Phone:
          this.othersAccountInformationForm.controls['confirmAccountPhone']
            .value,
        Fax: this.othersAccountInformationForm.controls['confirmAccountFax']
          .value,
        Email:
          this.othersAccountInformationForm.controls['confirmAccountEmail']
            .value,
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  checkProviderNpi(): void {
    console.log('checkProviderNpi function clicked');
    const payloadGetProviderDetails = {
      NPI: this.lookupInformationForm.get('providerNpi')?.value,
      FirstName: this.lookupInformationForm.get('providerFirstName')?.value,
      LastName: this.lookupInformationForm.get('providerLastName')?.value,
    };
    this.sharedService.isLoading.next(true); // loader start
    this.authService.getProviderDetails(payloadGetProviderDetails).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          console.log(this.lookupInformationForm);
          this.validPrescriberNPI = true;
          this.prescriberID = res.Payload[0].Id;
          // set values in a prescriber Account information form
          this.confirmAccountInformationForm.setValue({
            confirmAccountFirstName: payloadGetProviderDetails.FirstName,
            confirmAccountLastName: payloadGetProviderDetails.LastName,
            confirmAccountPhone: null,
            confirmAccountFax: null,
            confirmAccountEmail: '',
          });
          //disable the keys
          this.lookupInformationForm.controls['providerNpi'].disable();
          this.lookupInformationForm.controls['providerFirstName'].disable();
          this.lookupInformationForm.controls['providerLastName'].disable();
        } else {
          this.validPrescriberNPI = false;
          this.sharedService.notify('error', res.Errors[0].Message);
        }
        this.findPrescriberBtnClicked = true;
        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.findPrescriberBtnClicked = true;
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
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

  backTriggeredFromStepAddProvider(eventData: {
    backBtnClicked: boolean;
  }): void {
    this.addHealthcareProviderScreen = false;
    this.othersAddFacilityScreen = true;
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

  collectMasterFacilities(eventData: { facilities: any }): void {
    this.facilities = eventData.facilities;
    if (this.prescriberAddFacilityScreen) {
      this.prescriberSaveAndRegisterCall();
    }
  }

  collectPrescriberWithFacility(eventData: {
    prescribersWithSelectedFacility: any[];
  }): void {
    console.log(eventData.prescribersWithSelectedFacility);
  }

  accountFacilitiesRegistration(prevResponse: any, prevPayload: any): void {
    prevPayload['IsNewUser'] = false;
    prevPayload['UserContactDetails'][0]['Id'] = prevResponse.contactId;
    delete prevPayload.PrescriberId;
    this.facilities.forEach((facility: any) => {
      const facilityRegistrationPayload = {
        ...prevPayload,
        MasterAccountId: prevResponse.masterPortalAccountId,
        MasterFacility: facility,
      };

      console.log(facilityRegistrationPayload, 'facilityRegistrationPayload');
      this.sharedService.isLoading.next(true);
      this.authService
        .accountRegistration(facilityRegistrationPayload)
        .subscribe({
          next: (res: any) => {
            if (res.Status === 'SUCCESS') {
              console.log(res.Payload.facilityId);
            }
          },
          error: err => {
            this.sharedService.notify('error', err);
          },
        });
      this.sharedService.isLoading.next(false);
    });
  }

  prescriberSaveAndRegisterCall(): void {
    console.log(this.UserContactDetails, 'in usercontactdetails function');
    const accountRegistrationPayload = {
      Username: this.createUsernameForm.controls['username'].value,
      EmailAddress:
        this.confirmAccountInformationForm.controls['confirmAccountEmail']
          .value,
      Password: this.createUsernameForm.controls['newPassword'].value,
      PasswordConfirmation:
        this.createUsernameForm.controls['confirmNewPassword'].value,
      PrescriberId: this.prescriberID,
      IsNewUser: true,
      Role: {
        RolePkId: 3, // 3 for prescriber 5 for Others
      },
      UserContactDetails: this.UserContactDetails,
    };

    this.authService.accountRegistration(accountRegistrationPayload).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          console.log(res);
          if (res.Errors.length !== 0) {
            this.sharedService.notify('error', res.Errors[0]);
          }
          this.accountFacilitiesRegistration(
            res.Payload,
            accountRegistrationPayload
          );
        }
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });

    // after effects of call
    // this.prescriberAddFacilityScreen = false;
    // this.thankYouScreen = true;
  }

  othersSaveAndRegisterCall(): void {
    // API call for Others registration will be handle here

    // after effects of Call
    this.addHealthcareProviderScreen = false;
    this.thankYouScreen = true;
  }

  resetLookupForm(): void {
    this.validPrescriberNPI = false;
    this.lookupInformationForm.reset();
    this.lookupInformationForm.controls['providerNpi'].enable();
    this.lookupInformationForm.controls['providerFirstName'].enable();
    this.lookupInformationForm.controls['providerLastName'].enable();
    this.confirmAccountInformationForm.reset();
  }

  checkUsername(controlName: string): void {
    if (controlName === 'username') {
      console.log(this.createUsernameForm.controls['username'].value);
      const validateUsernamePayload =
        this.createUsernameForm.controls['username'].value;
      this.authService.validateUsername(validateUsernamePayload).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            console.log(res);
            this.invalidUsername = res.Payload;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }
}
