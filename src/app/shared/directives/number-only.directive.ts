import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appNumberOnly]',
})
export class NumberonlyDirective {
  constructor(public ngControl: NgControl, private _el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue
      ? initalValue.replace(/[^0-9]*/g, '')
      : '';
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
      this.ngControl?.control?.setValue(this._el.nativeElement.value);
    }
  }
}
