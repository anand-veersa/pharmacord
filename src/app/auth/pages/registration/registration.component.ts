import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../auth.service';
import { RegistrationScreenNextData } from '../../../models/registration-form-model';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/constants/app.constants';

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
  public invalidUsernameError: string = 'Username Already exist';
  public invalidUsername: boolean = false;
  public addFacilityScreenTitle: string = 'Associated Practice Office(s)';
  public addFacilityScreenSubTitle: string =
    'Please add or update the Practice/Facility information associated with this new account.';
  public addProviderScreenTitle = 'Associated Healthcare Provider(s)';
  public addProviderScreenSubTitle =
    'Please enter the information for each healthcare provider (HCP) associated with this new account.';
  public prescriberID: number;
  public facilities: Array<object> = [];
  public facilitiesDataForOthers: any[] = [];
  public UserContactDetails: Array<object> = [];
  public facilityIdsData: any[] = [];
  public prescribersWithSelectedFacility: any[] = [];
  public stepperLabelsProvider: string[] = ['', '', ''];
  public stepperLabelsHCP: string[] = ['', '', '', ''];
  public stepNumber: number = 0;
  public displayScreen: string = '';
  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService,
    private authService: AuthService,
    private appConstants: AppConstants
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/registration-forms.json')
      .subscribe((formData: any) => {
        this.lookupInformationFormData = formData.lookupInformationForm;
        this.confirmAccountInformationFormData =
          formData.confirmAccountInformationForm;
        this.createUsernameFormData = formData.createUsernamePasswordForm;
        this.lookupInformationForm = this.sharedService.buildForm(
          this.lookupInformationFormData
        );
        this.confirmAccountInformationForm = this.sharedService.buildForm(
          this.confirmAccountInformationFormData
        );
        this.createUsernameForm = this.sharedService.buildForm(
          this.createUsernameFormData
        );

        // others form
        this.othersAccountInformationFormData =
          formData.confirmAccountInformationForm;
        this.othersCreateUsernameFormData = formData.createUsernamePasswordForm;
        this.othersAccountInformationForm = this.sharedService.buildForm(
          this.othersAccountInformationFormData
        );
        this.othersCreateUsernameForm = this.sharedService.buildForm(
          this.othersCreateUsernameFormData
        );
      });
  }

  public toggleSelection(): void {
    this.othersRegistrationCard = !this.othersRegistrationCard;
    this.prescriberRegistrationCard = !this.othersRegistrationCard;
  }

  public registrationStep1(): void {
    this.accountTypeSelection = false;
    this.stepNumber++;
    if (this.prescriberRegistrationCard) {
      this.prescriberRegistration = true;
    } else {
      this.othersRegistration = true;
    }
  }

  public registrationStep2(): void {
    this.stepNumber++;
    if (this.prescriberRegistration) {
      this.prescriberRegistration = false;
      this.prescriberAddFacilityScreen = true;
      this.displayScreen = 'add-facility-prescriber';
      this.UserContactDetails.push({
        FirstName:
          this.confirmAccountInformationForm.controls['confirmAccountFirstName']
            .value,
        LastName:
          this.confirmAccountInformationForm.controls['confirmAccountLastName']
            .value,
        Phone: this.confirmAccountInformationForm.controls[
          'confirmAccountPhone'
        ].value.replace(/\D/g, ''),
        Fax: this.confirmAccountInformationForm.controls[
          'confirmAccountFax'
        ].value.replace(/\D/g, ''),
        Email:
          this.confirmAccountInformationForm.controls['confirmAccountEmail']
            .value,
      });
    } else {
      this.othersRegistration = false;
      this.othersAddFacilityScreen = true;
      this.displayScreen = 'add-facility-others';
      this.UserContactDetails.push({
        FirstName:
          this.othersAccountInformationForm.controls['confirmAccountFirstName']
            .value,
        LastName:
          this.othersAccountInformationForm.controls['confirmAccountLastName']
            .value,
        Phone: this.othersAccountInformationForm.controls[
          'confirmAccountPhone'
        ].value.replace(/\D/g, ''),
        Fax: this.othersAccountInformationForm.controls[
          'confirmAccountFax'
        ].value.replace(/\D/g, ''),
        Email:
          this.othersAccountInformationForm.controls['confirmAccountEmail']
            .value,
      });
    }
  }

  public onAction({
    actionType,
    formName,
    form,
    nextScreen,
  }: RegistrationScreenNextData): void {
    this.displayScreen = nextScreen;
    this.stepNumber =
      actionType === 'back' ? this.stepNumber - 1 : this.stepNumber + 1;
    if (actionType === 'back' && this.prescriberRegistrationCard) {
      this.prescriberAddFacilityScreen = false;
      this.prescriberRegistration = true;
      this.displayScreen = '';
    } else if (actionType === 'back' && nextScreen === 'othersRegistration') {
      this.othersRegistration = true;
      this.othersAddFacilityScreen = false;
    } else if (actionType === 'back' && nextScreen === 'add-facility-others') {
      this.addHealthcareProviderScreen = false;
      this.othersAddFacilityScreen = true;
    } else if (actionType === 'next') {
      this.othersAddFacilityScreen = false;
      this.addHealthcareProviderScreen = true;
    }
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.stepNumber = 0;
  }

  public checkProviderNpi(): void {
    const payloadGetProviderDetails = {
      NPI: this.lookupInformationForm.get('providerNpi')?.value,
      FirstName: this.lookupInformationForm.get('providerFirstName')?.value,
      LastName: this.lookupInformationForm.get('providerLastName')?.value,
    };
    this.sharedService.isLoading.next(true); // loader start
    this.authService.getProviderDetails(payloadGetProviderDetails).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
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

  public navigateToSelectAccountType(): void {
    this.stepNumber = 0;
    this.othersRegistration = false;
    this.prescriberRegistration = false;
    this.accountTypeSelection = true;
  }

  public collectMasterFacilities(eventData: { facilities: any }): void {
    this.facilities = eventData.facilities;
    if (this.prescriberAddFacilityScreen) {
      this.prescriberSaveAndRegisterCall();
    } else {
      this.facilitiesDataForOthers = eventData.facilities;
    }
  }

  public collectPrescriberWithFacility(eventData: {
    prescribersWithSelectedFacility: any[];
  }): void {
    this.prescribersWithSelectedFacility =
      eventData.prescribersWithSelectedFacility;
    this.othersSaveAndRegisterCall();
  }

  private accountFacilitiesRegistration(
    prevResponse: any,
    prevPayload: any
  ): void {
    prevPayload['IsNewUser'] = false;
    prevPayload['UserContactDetails'][0]['Id'] = prevResponse.contactId;
    delete prevPayload.PrescriberId;
    this.facilities.forEach((facility: any, index: number) => {
      const facilityRegistrationPayload = {
        ...prevPayload,
        MasterAccountId: prevResponse.masterPortalAccountId,
        MasterFacility: facility,
      };

      this.sharedService.isLoading.next(true);
      this.authService
        .accountRegistration(facilityRegistrationPayload)
        .subscribe({
          next: (res: any) => {
            if (res.Status === 'SUCCESS') {
              // this.sharedService.isLoading.next(false);
              // this.thankYouScreen = true;
              if (this.othersRegistrationCard) {
                this.facilityIdsData = [
                  ...this.facilityIdsData,
                  res.Payload.facilityId,
                ];
                if (this.facilityIdsData.length === this.facilities.length) {
                  this.prescriberFacilitiesRegistration(
                    prevResponse,
                    prevPayload
                  );
                }
              } else if (
                this.prescriberRegistrationCard &&
                index === this.facilities.length - 1
              ) {
                this.thankYouScreen = true;
              }
            }
          },
          error: err => {
            this.sharedService.notify('error', err);
          },
        });
      this.sharedService.isLoading.next(false);
    });
    this.sharedService.isLoading.next(false);
  }

  public prescriberSaveAndRegisterCall(): void {
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
        RolePkId: this.appConstants.PROVIDER_ROLE,
      },
      UserContactDetails: this.UserContactDetails,
    };
    this.sharedService.isLoading.next(true);
    this.authService.accountRegistration(accountRegistrationPayload).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
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

  private othersSaveAndRegisterCall(): void {
    // API call for Others registration will be handle here
    const othersAccountRegistrationPayload = {
      Username: this.othersCreateUsernameForm.controls['username'].value,
      EmailAddress:
        this.othersAccountInformationForm.controls['confirmAccountEmail'].value,
      Password: this.othersCreateUsernameForm.controls['newPassword'].value,
      PasswordConfirmation:
        this.othersCreateUsernameForm.controls['confirmNewPassword'].value,
      IsNewUser: true,
      Role: {
        RolePkId: this.appConstants.OTHERS_ROLE, // 4 for Others
      },
      UserContactDetails: this.UserContactDetails,
    };

    // account registration for other
    this.authService
      .accountRegistration(othersAccountRegistrationPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            if (res.Errors.length !== 0) {
              this.sharedService.notify('error', res.Errors[0]);
            }
            this.facilities = [...this.facilitiesDataForOthers];

            this.accountFacilitiesRegistration(
              res.Payload,
              othersAccountRegistrationPayload
            );

            // this.prescriberFacilitiesRegistration();
          }
        },
        error: err => {
          this.sharedService.isLoading.next(false);
          this.sharedService.notify('error', err);
        },
      });
  }

  private prescriberFacilitiesRegistration(
    prevResponse: any,
    prevPayload: any
  ): void {
    for (const provider of this.prescribersWithSelectedFacility) {
      for (const facilityIndex in this.facilityIdsData) {
        provider.facilities[facilityIndex].Id =
          this.facilityIdsData[facilityIndex];
      }

      for (const provider of this.prescribersWithSelectedFacility) {
        const providerWithFacilitiesPayload = {
          Username: prevPayload.Username,
          Password: prevPayload.Password,
          EmailAddress: prevPayload.EmailAddress,
          PasswordConfirmation: prevPayload.PasswordConfirmation,
          MasterAccountId: prevResponse.masterPortalAccountId,
          IsNewUser: false,
          PrescriberId: provider.PrescriberId,
          Facilities: this.formatFacilities(provider.facilities),
        };
        this.sharedService.isLoading.next(true);
        this.authService
          .accountRegistration(providerWithFacilitiesPayload)
          .subscribe({
            next: (res: any) => {
              this.sharedService.isLoading.next(false);
            },
            error: err => {
              this.sharedService.isLoading.next(false);
              this.sharedService.notify('error', err);
            },
          });
      }
    }
  }

  private formatFacilities(facilities: any[]) {
    let facilityPayload: any[] = [];

    for (const facility of facilities) {
      if ('Address' in facility) {
        delete facility.PhoneType;
        facility.Address = facility.Address[0];
        facilityPayload = [...facilityPayload, facility];
      } else {
        facilityPayload = [
          ...facilityPayload,
          {
            Address: {
              City: facility.City,
              Line1: facility.Address1,
              Line2: facility.Address2 === '' ? null : facility.Address2,
              State: facility.State,
              Zipcode: facility.Zip,
            },
            PracticeGroup: facility.GroupName,
            Email: facility.Email,
            Fax: facility.Fax,
            OfficeName: facility.GroupName,
            Rank: 1,
            Id: facility.Id,
            Phone: facility.Phone,
            Extension: null,
            Contacts: [],
          },
        ];
      }
    }
    return facilityPayload;
  }

  public resetLookupForm(): void {
    this.validPrescriberNPI = false;
    this.findPrescriberBtnClicked = false;
    this.lookupInformationForm.reset();
    this.lookupInformationForm.controls['providerNpi'].enable();
    this.lookupInformationForm.controls['providerFirstName'].enable();
    this.lookupInformationForm.controls['providerLastName'].enable();
    this.confirmAccountInformationForm.reset();
  }

  public checkUsername(controlName: string): void {
    this.invalidUsername = false;
    if (controlName === 'username') {
      const validateUsernamePayload =
        this.createUsernameForm.controls['username'].value;
      this.authService.validateUsername(validateUsernamePayload).subscribe({
        next: (res: any) => {
          if (res.Status === 'SUCCESS') {
            this.invalidUsername = !res.Payload;
          }
        },
        error: (err: any) => {
          this.sharedService.isLoading.next(false);
          this.sharedService.notify('error', err);
        },
      });
    }
  }
}
