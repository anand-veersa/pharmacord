import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CustomButtonComponent } from './components/forms/custom-button/custom-button.component';
import { CustomSelectComponent } from './components/forms/custom-select/custom-select.component';
import { CustomRadioComponent } from './components/forms/custom-radio/custom-radio.component';
import { CustomCheckboxComponent } from './components/forms/custom-checkbox/custom-checkbox.component';
import { CustomInputComponent } from './components/forms/custom-input/custom-input.component';
import { CustomFormComponent } from './components/forms/custom-form/custom-form.component';

import { ChartModule } from 'primeng/chart';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { LocalStorageService } from './services/local-storage.service';
import { CustomSpinnerComponent } from './components/custom-spinner/custom-spinner.component';
import { CustomErrorComponent } from './components/forms/custom-error/custom-error.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { CustomAddFacilityComponent } from './components/custom-add-facility/custom-add-facility.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    CustomButtonComponent,
    CustomSelectComponent,
    CustomRadioComponent,
    CustomCheckboxComponent,
    CustomFormComponent,
    CustomInputComponent,
    CustomSpinnerComponent,
    CustomErrorComponent,
    PdfViewerComponent,
    CustomTableComponent,
    CustomAddFacilityComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    RouterModule,
    PdfViewerModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    CustomButtonComponent,
    CustomSelectComponent,
    CustomRadioComponent,
    CustomCheckboxComponent,
    CustomFormComponent,
    CustomInputComponent,
    CustomSpinnerComponent,
    CustomTableComponent,
    CustomAddFacilityComponent,
  ],
  providers: [LocalStorageService],
})
export class SharedModule {}
