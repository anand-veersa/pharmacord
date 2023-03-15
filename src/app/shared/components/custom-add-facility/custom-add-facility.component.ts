import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-custom-add-facility',
  templateUrl: './custom-add-facility.component.html',
  styleUrls: ['./custom-add-facility.component.scss'],
})
export class CustomAddFacilityComponent implements OnInit {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() requirementFor: string = '';
  public addFacilityFormData: JsonFormData;
  public addFacilityForm: FormGroup;
  public editClicked: boolean = false;
  constructor(private sharedService: SharedService, private http: HttpClient) {}
  ngOnInit(): void {
    console.log('oninit of customAddFacility');
    this.http
      .get('/assets/json/add-facility-information-form.json')
      .subscribe((formData: any) => {
        this.addFacilityFormData = formData;
        this.addFacilityForm = this.sharedService.buildForm(
          this.addFacilityFormData
        );
      });
  }
}
