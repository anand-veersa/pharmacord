import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { MaterialModule } from '../material.module';
import { ChartModule } from 'primeng/chart';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { EnrollmentService } from './enrollment.service';

import { EnrollmentComponent } from './enrollment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { MyPatientsComponent } from './pages/my-patients/my-patients.component';
import { SubmitReferralComponent } from './pages/submit-referral/submit-referral.component';
import { ToolsAndFormsComponent } from './pages/tools-and-forms/tools-and-forms.component';
import { ChartsComponent } from '../enrollment/components/charts/charts.component';
import { ActionNeededComponent } from './components/action-needed/action-needed.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
@NgModule({
  declarations: [
    EnrollmentComponent,
    DashboardComponent,
    AccountSettingsComponent,
    MyPatientsComponent,
    SubmitReferralComponent,
    ToolsAndFormsComponent,
    ActionNeededComponent,
    ChartsComponent,
    PatientProfileComponent,
  ],
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    SharedModule,
    MaterialModule,
    ChartModule,
    PdfViewerModule,
  ],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
