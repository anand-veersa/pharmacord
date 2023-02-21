import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CustomButtonComponent } from './forms/custom-button/custom-button.component';
import { LocalStorageService } from './local-storage.service';
import { CustomSelectComponent } from './forms/custom-select/custom-select.component';
import { CustomRadioComponent } from './forms/custom-radio/custom-radio.component';
import { CustomCheckboxComponent } from './forms/custom-checkbox/custom-checkbox.component';
import { CustomFormComponent } from './forms/custom-form/custom-form.component';
import { MaterialModule } from '../material.module';
import { CustomInputComponent } from './forms/custom-input/custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
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
  ],
})
export class SharedModule {}
