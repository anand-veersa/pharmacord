import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { EnrollmentComponent } from './enrollment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { MyPatientsComponent } from './pages/my-patients/my-patients.component';
import { SubmitReferralComponent } from './pages/submit-referral/submit-referral.component';
import { ToolsAndFormsComponent } from './pages/tools-and-forms/tools-and-forms.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EnrollmentComponent,
    DashboardComponent,
    AccountSettingsComponent,
    MyPatientsComponent,
    SubmitReferralComponent,
    ToolsAndFormsComponent
  ],
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    SharedModule
  ]
})
export class EnrollmentModule { }
