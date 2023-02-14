import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './input-field/input-field.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [InputFieldComponent],
  imports: [CommonModule, MaterialModule],
})
export class CoreModule {}
