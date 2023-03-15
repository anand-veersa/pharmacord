import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-add-healthcare-provider',
  templateUrl: './add-healthcare-provider.component.html',
  styleUrls: ['./add-healthcare-provider.component.scss'],
})
export class AddHealthcareProviderComponent implements OnInit {
  @Input() componentTitle: string = '';
  @Input() componentSubTitle: string = '';
  @Input() requirementFor: string = '';

  public addProviderFormData: JsonFormData;
  public addProviderForm: FormGroup;
  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('ngoninit of AddHealthcareProviderComponent');

    this.http
      .get('/assets/json/add-provider-form.json')
      .subscribe((formData: any) => {
        this.addProviderFormData = formData;
        this.addProviderForm = this.sharedService.buildForm(
          this.addProviderFormData
        );
      });
  }

  checkProviderDetails(): void {
    const payloadGetProviderDetails = {
      NPI: this.addProviderForm?.get('HCPNPI')?.value,
      FirstName: this.addProviderForm?.get('HCPFirstName')?.value,
      LastName: this.addProviderForm?.get('HCPLastName')?.value,
    };
    this.sharedService.isLoading.next(true);
    this.authService.getProviderDetails(payloadGetProviderDetails).subscribe({
      next: (res: any) => {
        if (res.Status === 'SUCCESS') {
          console.log(res);
        } else {
          this.sharedService.notify('error', res.Errors[0].Message);
        }
        this.sharedService.isLoading.next(false);
      },
      error: err => {
        this.sharedService.isLoading.next(false);
        this.sharedService.notify('error', err);
      },
    });
  }
}
