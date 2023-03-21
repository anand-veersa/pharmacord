import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EnrollmentFormPayload,
  EnrollmentScreenNextData,
} from 'src/app/models/enrollment-form.model';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SelectMedicationComponent } from '../../components/select-medication/select-medication.component';
import { SelectPrescriberComponent } from '../../components/select-prescriber/select-prescriber.component';
import { EnrollmentService } from '../../enrollment.service';

@Component({
  selector: 'app-submit-enrollment',
  templateUrl: './submit-enrollment.component.html',
  styleUrls: ['./submit-enrollment.component.scss'],
})
export class SubmitEnrollmentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('enrollmentForm', { read: ViewContainerRef })
  enrollmentForm: ViewContainerRef;
  public title: string = 'Medication For Patient Enrollment';
  public displayScreen: string = 'select-medication';
  public enrollmentFormPayload: EnrollmentFormPayload = {};
  public prescriberListJson: JsonFormData = { controls: [] };
  public selectPrescriberForm: FormGroup;
  public componentsByScreen = [
    {
      screen: 'select-medication',
      component: SelectMedicationComponent,
    },
    {
      screen: 'select-prescriber',
      component: SelectPrescriberComponent,
    },
  ];

  constructor(
    private enrolService: EnrollmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.getComponentByScreen();
  }

  public next({ formName, form, nextScreen }: EnrollmentScreenNextData) {
    this.displayScreen = nextScreen;
    if (formName === 'select-medication') {
      this.enrollmentFormPayload.DrugGroup = form.DrugGroup;
    }
    this.getComponentByScreen();
  }

  private getComponentByScreen() {
    const compByScreen = this.componentsByScreen.find(
      c => c.screen === this.displayScreen
    );
    const compInstance: ComponentType =
      compByScreen?.component || SelectMedicationComponent;
    this.enrollmentForm.clear();
    const dynamicComponent = this.enrollmentForm.createComponent(compInstance);
    if (compInstance !== SelectMedicationComponent) {
      dynamicComponent.setInput(
        'selectedMedication',
        this.enrollmentFormPayload.DrugGroup
      );
    }
    if (compInstance === SelectPrescriberComponent) {
      dynamicComponent.instance.prescriberListJson.subscribe(
        (json: JsonFormData) => (this.prescriberListJson = json)
      );
      dynamicComponent.instance.selectPrescriberForm.subscribe(
        (form: FormGroup) => (this.selectPrescriberForm = form)
      );
    }
    dynamicComponent.instance.title.subscribe(
      (title: string) => (this.title = title)
    );
    dynamicComponent.instance.nextAction.subscribe(
      (data: EnrollmentScreenNextData) => this.next(data)
    );
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.enrolService.submitFormInitiated.next(false);
  }
}

interface ComponentType<T = any> {
  new (...args: any[]): T;
}
