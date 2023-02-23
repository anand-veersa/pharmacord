import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomCheckboxComponent } from '../custom-checkbox/custom-checkbox.component';
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
  @Input() form: FormGroup;
  @Input() field: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public supportedDynamicComponents = [
    {
      type: 'text',
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
      component: CustomInputComponent,
    },
    {
      type: 'checkbox',
      component: CustomCheckboxComponent,
    },
  ];

  ngAfterViewInit() {
    const componentInstance = this.getComponentByType(this.field.type);
    const dynamicComponent =
      this.dynamicForm.createComponent(componentInstance);
    dynamicComponent.setInput('form', this.form);
    dynamicComponent.setInput('field', this.field);
    this.changeDetectorRef.detectChanges();
  }

  getComponentByType(type: string) {
    const dynamicComponent = this.supportedDynamicComponents.find(
      c => c.type === this.field.type
    );
    return dynamicComponent?.component || CustomInputComponent;
  }
}
