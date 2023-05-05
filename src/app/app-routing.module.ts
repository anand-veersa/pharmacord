import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectDocusignComponent } from './enrollment/components/redirect-docusign/redirect-docusign.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'enrollment',
    loadChildren: () =>
      import('./enrollment/enrollment.module').then(m => m.EnrollmentModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'onredirectionfromdocusign',
    component: RedirectDocusignComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
