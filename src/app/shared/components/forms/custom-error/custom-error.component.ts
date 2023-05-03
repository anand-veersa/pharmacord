import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-custom-error',
  templateUrl: './custom-error.component.html',
  styleUrls: ['./custom-error.component.scss'],
})
export class CustomErrorComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() field: any;
  @Input() errors: any;
  public errorMessage = '';

  constructor(private sharedService: SharedService) {}

  ngOnChanges() {
    this.errorMessage = this.sharedService.getErrorMessage(
      this.errors,
      this.field.label
    );
  }
}
