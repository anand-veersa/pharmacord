import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
})
export class CustomStepperComponent implements OnChanges {
  @Input() background: string = '';
  @Input() labelsData: string[] = ['step1', 'step2', 'step3', 'step4', 'step5'];
  @Input() selectedStepNumber: number = 0;
  @Input() requirementFor: string = '';

  @ViewChild('stepper') stepper: MatStepper;

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     for (let i = 0; i < this.selectedStepNumber; i++) {
  //       this.stepper.next();
  //     }
  //   }, 0);
  // }

  ngOnChanges(): void {
    this.stepper.reset();
    setTimeout(() => {
      for (let i = 0; i < this.selectedStepNumber; i++) {
        this.stepper.next();
      }
    }, 0);
  }
}
