import {
  AfterViewInit,
  Component,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import { CustomCheckboxComponent } from '../custom-checkbox/custom-checkbox.component';
import { CustomDatepickerComponent } from '../custom-datepicker/custom-datepicker.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { CustomRadioComponent } from '../custom-radio/custom-radio.component';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
})
export class CustomFormComponent implements AfterViewInit {
  @ViewChild('dynamicForm', { read: ViewContainerRef })
  dynamicForm!: ViewContainerRef;
  @Input() form!: FormGroup;
  @Input() formType: string = '';
  @Input() field: JsonFormControls;
  @Input() inputPrefix: string;
  @Input() checked: any[] = [];
  @Output() action = new EventEmitter();

  public supportedDynamicComponents = [
    {
      type: 'text',
      component: CustomInputComponent,
    },
    {
      type: 'search',
      component: CustomInputComponent,
    },
    {
      type: 'number',
      component: CustomInputComponent,
    },
    {
      type: 'select',
      component: CustomSelectComponent,
    },
    {
      type: 'radio',
      component: CustomRadioComponent,
    },
    {
      type: 'date',
      component: CustomDatepickerComponent,
    },
    {
      type: 'checkbox',
      component: CustomCheckboxComponent,
    },
  ];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngAfterViewInit() {
    if (!this.dynamicForm) return;
    const componentInstance = this.getComponentByType();
    const dynamicComponent =
      this.dynamicForm.createComponent(componentInstance);
    dynamicComponent.setInput('form', this.form);
    dynamicComponent.setInput('field', this.field);
    dynamicComponent.setInput('formType', this.formType);
    if (componentInstance === CustomInputComponent) {
      dynamicComponent.setInput('inputPrefix', this.inputPrefix);
    }
    if (componentInstance === CustomCheckboxComponent) {
      dynamicComponent.setInput('checked', this.checked);
    }
    if (
      componentInstance === CustomSelectComponent ||
      componentInstance === CustomCheckboxComponent
    ) {
      dynamicComponent.instance.action.subscribe(
        (data: string | number | { value: string | number; field: any }) =>
          this.action.emit(data)
      );
    }
    this.changeDetectorRef.detectChanges();
  }

  getComponentByType(): ComponentType {
    const dynamicComponent = this.supportedDynamicComponents.find(
      c => c.type === this.field.type
    );
    return dynamicComponent?.component || CustomInputComponent;
  }

  navigateRoute() {
    if (this.field.extLink === 'Forgot Username?') {
      this.router.navigate(['/reset-username']);
    } else {
      this.router.navigate(['/reset-password']);
    }
  }
}
interface ComponentType<T = any> {
  new (...args: any[]): T;
}
