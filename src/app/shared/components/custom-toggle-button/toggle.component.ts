import { Component, Output, EventEmitter, Input } from '@angular/core';
@Component({
  selector: 'app-custom-toggle-button',
  template: `
    <input
      type="checkbox"
      id="{{ idString }}"
      [disabled]="consent"
      (change)="onChange($event)"
      [(ngModel)]="value" />
    <label
      class="toggle-button-switch"
      [id]="idString"
      [for]="idString"></label>
    <div class="toggle-button-text" (click)="toggleClick()">
      <div class="toggle-button-text-on">Yes</div>
      <div class="toggle-button-text-off">No</div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 44px;
        height: 23px;
      }

      input[type='checkbox'] {
        display: none;
      }

      .toggle-button-switch {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        background-color: #dadada;
        border-radius: 100%;
        cursor: pointer;
        z-index: 100;
        transition: left 0.3s;
      }

      .toggle-button-text {
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 11.5px;
        transition: background-color 0.3s;
        border: 1px solid #dadada;
        cursor: pointer;
      }

      .toggle-button-text-on,
      .toggle-button-text-off {
        float: left;
        width: 50%;
        height: 100%;
        line-height: 22px;
        font-size: 9px;
        font-family: 'Raleway', sans-serif;
        font-weight: 500;
        color: #1b1b1b;
        text-align: center;
      }

      .toggle-button-text-on {
        padding-left: 3px;
      }

      input[type='checkbox']:checked ~ .toggle-button-switch {
        background-color: #37bfcb;
        left: 23px;
      }

      input[type='checkbox']:checked ~ .toggle-button-text {
        background-color: #ffffff;
        border: 1px solid #37bfcb;
      }
    `,
  ],
})
export class ToggleButtonComponent {
  @Output() changed = new EventEmitter<boolean>();
  @Input() idString: string;
  @Input() value: boolean;
  @Input() consent: boolean = false;

  toggleClick() {
    document.getElementById(this.idString)?.click();
  }

  public onChange(event: Event): void {
    this.changed.emit((<HTMLInputElement>event.target)?.checked);
  }
}
