import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CustomButtonComponent } from './custom-button/custom-button.component';
import { LocalStorageService } from './local-storage.service';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    CustomButtonComponent,
  ],
  imports: [CommonModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    CustomButtonComponent,
  ],
})
export class SharedModule {}
