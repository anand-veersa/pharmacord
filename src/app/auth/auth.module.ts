import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { ForgotUsernameComponent } from './pages/forgot-username/forgot-username.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../core/interceptors/auth-interceptor.service';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AddFacilityComponent } from './pages/registration/add-facility/add-facility.component';
import { AddHealthcareProviderComponent } from './pages/registration/add-healthcare-provider/add-healthcare-provider.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    ForgotUsernameComponent,
    ForgotPasswordComponent,
    RegistrationComponent,
    AddFacilityComponent,
    AddHealthcareProviderComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  exports: [AddFacilityComponent, AddHealthcareProviderComponent],
})
export class AuthModule {}
