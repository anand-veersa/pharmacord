import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ProfileComponent } from './profile.component';

const routes: Routes = [{ path: '', component: ProfileComponent }];
@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileModule {}
