import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
})
export class ProfileInformationComponent implements OnInit {
  public formData: JsonFormData;
  public profileInformationForm: FormGroup;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .get('/assets/json/profile-information.json')
      .subscribe((formData: any) => {
        this.formData = formData;
        this.profileInformationForm = this.sharedService.buildForm(
          this.formData
        );
      });
  }
  public navigateToHome(): void {
    this.router.navigate(['/enrollment/dashboard']);
  }
  public saveProfileInformation(): void {
    console.log('saveProfileInformation');
  }
}
