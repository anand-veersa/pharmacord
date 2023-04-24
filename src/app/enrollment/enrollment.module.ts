import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { MaterialModule } from '../material.module';
import { ChartModule } from 'primeng/chart';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { EnrollmentService } from './enrollment.service';

import { EnrollmentComponent } from './enrollment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { MyPatientsComponent } from './pages/my-patients/my-patients.component';
import { ToolsAndFormsComponent } from './pages/tools-and-forms/tools-and-forms.component';
import { ChartsComponent } from '../enrollment/components/charts/charts.component';
import { ActionNeededComponent } from './components/action-needed/action-needed.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { SubmitEnrollmentComponent } from './pages/submit-enrollment/submit-enrollment.component';
import { EnrollmentFormHeaderComponent } from './components/enrollment-form-header/enrollment-form-header.component';
import { SelectMedicationComponent } from './components/select-medication/select-medication.component';
import { SelectPrescriberComponent } from './components/select-prescriber/select-prescriber.component';
import { SubmitEnrollmentService } from './pages/submit-enrollment/submit-enrollment.service';
import { SelectServicesComponent } from './components/select-services/select-services.component';
import { SelectPatientComponent } from './components/select-patient/select-patient.component';
import { PrescriberDetailsComponent } from './components/prescriber-details/prescriber-details.component';
import { AuthModule } from '../auth/auth.module';
import { SelectInsuranceComponent } from './components/select-insurance/select-insurance.component';
@NgModule({
  declarations: [
    EnrollmentComponent,
    DashboardComponent,
    AccountSettingsComponent,
    MyPatientsComponent,
    ToolsAndFormsComponent,
    ActionNeededComponent,
    ChartsComponent,
    PatientProfileComponent,
    SubmitEnrollmentComponent,
    EnrollmentFormHeaderComponent,
    SelectMedicationComponent,
    SelectPrescriberComponent,
    SelectServicesComponent,
    SelectPatientComponent,
    PrescriberDetailsComponent,
    SelectInsuranceComponent,
  ],
  providers: [EnrollmentService, SubmitEnrollmentService],
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    SharedModule,
    MaterialModule,
    ChartModule,
    PdfJsViewerModule,
    AuthModule,
  ],
})
export class EnrollmentModule {}
