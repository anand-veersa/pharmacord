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
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { LocalStorageService } from './services/local-storage.service';
import { CustomSpinnerComponent } from './components/custom-spinner/custom-spinner.component';
import { CustomErrorComponent } from './components/forms/custom-error/custom-error.component';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { CustomExpansionPanelComponent } from './components/custom-expansion-panel/custom-expansion-panel.component';
import { CustomDatepickerComponent } from './components/forms/custom-datepicker/custom-datepicker.component';
import { ToggleButtonComponent } from './components/custom-toggle-button/toggle.component';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { CustomPrescriptionComponent } from './components/forms/custom-prescription/custom-prescription.component';
import { CustomUploadDocumentsComponent } from './components/custom-upload-documents/custom-upload-documents.component';
import { CustomStepperComponent } from './components/custom-stepper/custom-stepper.component';
import { NumberformatDirective } from './directives/phone-format.directive';
import { SafePipe } from './pipes/safe-pipe';
import { CustomTooltipComponent } from './components/forms/custom-tooltip/custom-tooltip.component';
import { NumberonlyDirective } from './directives/number-only.directive';

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
    CustomTableComponent,
    CustomExpansionPanelComponent,
    CustomDatepickerComponent,
    ToggleButtonComponent,
    CustomDialogComponent,
    CustomPrescriptionComponent,
    CustomUploadDocumentsComponent,
    CustomStepperComponent,
    NumberformatDirective,
    NumberonlyDirective,
    SafePipe,
    CustomTooltipComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    RouterModule,
    PdfJsViewerModule,
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
    CustomExpansionPanelComponent,
    ToggleButtonComponent,
    CustomDialogComponent,
    CustomPrescriptionComponent,
    CustomErrorComponent,
    CustomDatepickerComponent,
    CustomUploadDocumentsComponent,
    CustomStepperComponent,
    NumberformatDirective,
    NumberonlyDirective,
    SafePipe,
  ],
  providers: [LocalStorageService],
})
export class SharedModule {}
