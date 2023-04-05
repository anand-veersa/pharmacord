import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JsonFormData } from 'src/app/models/json-form-data.model';
import { SubmitEnrollmentService } from '../../pages/submit-enrollment/submit-enrollment.service';
@Component({
  selector: 'app-enrollment-form-header',
  templateUrl: './enrollment-form-header.component.html',
  styleUrls: ['./enrollment-form-header.component.scss'],
})
export class EnrollmentFormHeaderComponent implements OnInit, OnDestroy {
  @Input() displayedScreen: string = '';
  @Input() selectPrescriberForm: FormGroup;
  @Input() selectPrescriberField: JsonFormData;
  @Output() prescriberChanged = new EventEmitter();
  public title: string = '';
  public titleSubscription: Subscription;

  constructor(private submitEnrolService: SubmitEnrollmentService) {}

  ngOnInit(): void {
    this.titleSubscription = this.submitEnrolService.headerTitle.subscribe(
      title => (this.title = title)
    );
  }

  ngOnDestroy(): void {
    this.titleSubscription.unsubscribe();
  }
}
