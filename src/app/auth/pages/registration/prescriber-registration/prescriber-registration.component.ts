import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-prescriber-registration',
  templateUrl: './prescriber-registration.component.html',
  styleUrls: ['./prescriber-registration.component.scss'],
})
export class PrescriberRegistrationComponent implements OnInit {
  public lookupInformationFormData: JsonFormData;
  public lookupInformationForm: FormGroup;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  ngOnInit() {
    console.log('oninit of prescriber registration component');
    this.http
      .get('/assets/json/lookup-information-form.json')
      .subscribe((formData: any) => {
        this.lookupInformationFormData = formData;
        this.lookupInformationForm = this.sharedService.buildForm(
          this.lookupInformationFormData
        );
      });
  }
}
