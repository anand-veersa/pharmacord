import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CustomButtonComponent } from './components/forms/custom-button/custom-button.component';
import { CustomSelectComponent } from './components/forms/custom-select/custom-select.component';
import { CustomRadioComponent } from './components/forms/custom-radio/custom-radio.component';
import { ChartsComponent } from './components/charts/charts.component';
import { CustomCheckboxComponent } from './components/forms/custom-checkbox/custom-checkbox.component';
import { CustomInputComponent } from './components/forms/custom-input/custom-input.component';
import { CustomFormComponent } from './components/forms/custom-form/custom-form.component';

import { ChartModule } from 'primeng/chart';
import { MaterialModule } from '../material.module';

import { LocalStorageService } from './services/local-storage.service';

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
    ChartsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
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
    ChartsComponent,
  ],
  providers: [LocalStorageService],
})
export class SharedModule {}
