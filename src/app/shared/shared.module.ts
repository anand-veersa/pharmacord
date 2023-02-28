import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CustomButtonComponent } from './components/forms/custom-button/custom-button.component';
import { LocalStorageService } from './services/local-storage.service';
import { CustomSelectComponent } from './components/forms/custom-select/custom-select.component';
import { CustomRadioComponent } from './components/forms/custom-radio/custom-radio.component';
import { CustomCheckboxComponent } from './components/forms/custom-checkbox/custom-checkbox.component';
import { CustomFormComponent } from './components/forms/custom-form/custom-form.component';
import { MaterialModule } from '../material.module';
import { CustomInputComponent } from './components/forms/custom-input/custom-input.component';
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
  providers: [LocalStorageService],
})
export class SharedModule {}
