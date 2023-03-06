import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { EnrollmentComponent } from './enrollment.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyPatientsComponent } from './pages/my-patients/my-patients.component';
import { ToolsAndFormsComponent } from './pages/tools-and-forms/tools-and-forms.component';

const routes: Routes = [
  {
    path: '',
    component: EnrollmentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'patients',
        component: MyPatientsComponent,
      },
      {
        path: 'tools-and-forms',
        component: ToolsAndFormsComponent,
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrollmentRoutingModule {}
