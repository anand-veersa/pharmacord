import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { CoreModule } from './core/core.module';
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { AuthInterceptor } from './core/interceptors/auth-interceptor.service';

import { AppComponent } from './app.component';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AuthModule,
    EnrollmentModule,
    SharedModule,
    HttpClientModule,
    ChartModule,
    RouterModule,
    PdfJsViewerModule,
    ProfileModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
