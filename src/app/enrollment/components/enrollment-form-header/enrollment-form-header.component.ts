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
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-enrollment-form-header',
  templateUrl: './enrollment-form-header.component.html',
  styleUrls: ['./enrollment-form-header.component.scss'],
})
export class EnrollmentFormHeaderComponent implements OnInit, OnDestroy {
  @Input() displayedScreen: string = '';
  @Input() selectPrescriberForm: FormGroup;
  @Input() selectPrescriberField: JsonFormData;
  @Input() stepNumber: number = 0;
  @Output() prescriberChanged = new EventEmitter();
  public title: string = '';
  public titleSubscription: Subscription;
  public stepperLables: string[] = [
    'Services Requested',
    'Patient Information',
    'Prescriber Information',
    'Insurance Information',
    'Clinical Information',
    'Attestation and Signatures',
  ];
  public showStepper: boolean = false;
  public prescriberName: string = '';
  public isPrescriber: boolean = false;
  constructor(
    private submitEnrolService: SubmitEnrollmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.titleSubscription = this.submitEnrolService.headerTitle.subscribe(
      title => (this.title = title)
    );
    if (this.authService.user.role.RolePkId === 3) {
      this.isPrescriber = true;
      this.prescriberName =
        this.authService.user.firstName + ' ' + this.authService.user.lastName;
      // this.prescriberChanged.emit(this.authService.user.portalAccountPkId);
    }
  }

  ngOnChanges() {
    if (this.stepNumber == 2) {
      this.prescriberName =
        this.submitEnrolService.selectedPrescriber.FirstName +
        ' ' +
        this.submitEnrolService.selectedPrescriber.LastName;
    }
    if (this.stepNumber >= 2) {
      this.showStepper = true;
    } else {
      this.showStepper = false;
    }
  }

  ngOnDestroy(): void {
    this.titleSubscription.unsubscribe();
  }
}
