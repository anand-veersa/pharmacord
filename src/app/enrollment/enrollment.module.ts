import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { EnrollmentComponent } from './enrollment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { MyPatientsComponent } from './pages/my-patients/my-patients.component';
import { SubmitReferralComponent } from './pages/submit-referral/submit-referral.component';
import { ToolsAndFormsComponent } from './pages/tools-and-forms/tools-and-forms.component';
import { ChartsComponent } from '../enrollment/components/charts/charts.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { EnrollmentService } from './enrollment.service';
import { ActionNeededComponent } from './components/action-needed/action-needed.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../core/interceptors/auth-interceptor.service';
import { ChartModule } from 'primeng/chart';
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
  ],
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    SharedModule,
    MaterialModule,
    ChartModule,
  ],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
