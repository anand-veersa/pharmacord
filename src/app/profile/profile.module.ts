import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ProfileComponent } from './profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeSecurityQuestionsComponent } from './components/change-security-questions/change-security-questions.component';
import { ProfileInformationComponent } from './components/profile-information/profile-information.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: '', component: ProfileComponent }];
@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    ChangeSecurityQuestionsComponent,
    ProfileInformationComponent,
  ],
  exports: [RouterModule],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class ProfileModule {}
