import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
})
export class CustomButtonComponent {
  @Input() btnText: string = '';
  @Input() isDisabled: boolean = false;
  @Input() btnType: string = '';
}