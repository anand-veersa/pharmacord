import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EnrollmentScreenNextData } from 'src/app/models/enrollment-form.model';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { EnrollmentService } from '../../enrollment.service';
import { SubmitEnrollmentService } from './submit-enrollment.service';

@Component({
  selector: 'app-submit-enrollment',
  templateUrl: './submit-enrollment.component.html',
  styleUrls: ['./submit-enrollment.component.scss'],
})
export class SubmitEnrollmentComponent implements OnInit, OnDestroy {
  @ViewChild('enrollmentForm', { read: ViewContainerRef })
  enrollmentForm: ViewContainerRef;
  public title: string;
  public displayScreen: string = 'select-medication';
  public selectedFacility: any;
  public formInitiated: boolean = false;
  public openExitDialog: boolean = false;
  public prescriberListJson: JsonFormData = { controls: [] };
  public selectPrescriberForm: FormGroup;
  public exitSubject = new Subject<boolean>();
  public stepperCount: number = 0;

  constructor(
    public submitEnrolService: SubmitEnrollmentService,
    private enrolService: EnrollmentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http
      .get('/assets/json/patient-referral.json')
      .subscribe(
        (data: any) => (this.submitEnrolService.enrollmentFormPayload = data)
      );
  }

  public onAction({
    actionType,
    formName,
    form,
    nextScreen,
  }: EnrollmentScreenNextData): void {
    // debugger
    this.stepperCount =
      actionType === 'next' ? this.stepperCount + 1 : this.stepperCount - 1;
    // TODO: optimize this
    this.displayScreen = nextScreen;
    // if(actionType=== 'next') {
    if (formName === 'select-medication') {
      this.submitEnrolService.enrollmentFormPayload.DrugGroup = form.DrugGroup;
      this.formInitiated = true;
    }
    if (formName === 'select-prescriber') {
      this.selectedFacility = form;
    }
    if (formName === 'select-services') {
      this.submitEnrolService.enrollmentFormPayload.EnrollmentServiceRequests =
        form.services.Services;
      this.submitEnrolService.enrollmentFormPayload.PreferredSpecialityPharmacy =
        [form.pharmacy.SpecialityPharmacy];
    }
    if (formName === 'select-patient') {
      console.log(form);
    }
    if (formName === 'prescriber-details') {
      console.log(form);
    }
    console.log(this.submitEnrolService.enrollmentFormPayload);
  }

  // private getComponentByScreen(): void {
  //   const compByScreen = this.componentsByScreen.find(
  //     c => c.screen === this.displayScreen
  //   );
  //   const compInstance: ComponentType =
  //     compByScreen?.component || SelectMedicationComponent;
  //   this.enrollmentForm.clear();
  //   const dynamicComponent = this.enrollmentForm.createComponent(compInstance);
  //   if (compInstance !== SelectMedicationComponent) {
  //     dynamicComponent.setInput(
  //       'selectedMedication',
  //       this.enrollmentFormPayload.DrugGroup
  //     );
  //   }
  //   if (compInstance === SelectPrescriberComponent) {
  //     dynamicComponent.instance.prescriberListJson.subscribe(
  //       (json: JsonFormData) => (this.prescriberListJson = json)
  //     );
  //     dynamicComponent.instance.selectPrescriberForm.subscribe(
  //       (form: FormGroup) => (this.selectPrescriberForm = form)
  //     );
  //   }
  //   dynamicComponent.instance.title.subscribe(
  //     (title: string) => (this.title = title)
  //   );
  //   dynamicComponent.instance.action.subscribe(
  //     (data: EnrollmentScreenNextData) => this.onAction(data)
  //   );
  //   this.cdr.detectChanges();
  // }

  public getPrescribersFormData(formData: any): void {
    this.selectPrescriberForm = formData.selectPrescriberForm;
    this.prescriberListJson = formData.prescriberListJson;
  }

  public openDialog(): void {
    this.openExitDialog = true;
  }

  public confirmExit(action: boolean) {
    this.openExitDialog = false;
    this.exitSubject.next(action);
  }

  ngOnDestroy(): void {
    this.enrolService.submitFormInitiated.next(false);
    this.submitEnrolService.selectedPrescriberId.next(0);
    this.submitEnrolService.resetForms();
  }
}

// interface ComponentType<T = any> {
//   new (...args: any[]): T;
// }
