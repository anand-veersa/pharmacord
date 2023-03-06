import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
})
export class CustomButtonComponent {
  @Input() btnText: string = 'Submit';
  @Input() isDisabled: boolean = false;
  @Input() btnClass: string = 'primary';
  @Input() btnIcon: string = '';
  @Output() action = new EventEmitter();

  public buttonClicked() {
    this.action.emit(true);
  }
}
