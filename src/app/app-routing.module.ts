import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/pages/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './auth/pages/forgot-username/forgot-username.component';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./enrollment/enrollment.module').then(m => m.EnrollmentModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-username',
    component: ForgotUsernameComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
