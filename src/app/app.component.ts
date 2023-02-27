import { Component, OnInit } from '@angular/core';
import { SharedFormService } from './shared/services/shared-form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'enhancement';
  public isLoading: boolean = false;
  constructor(private formService: SharedFormService) {}

  ngOnInit() {
    this.formService.isLoading.subscribe(state => (this.isLoading = state));
  }
}
