import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberformat]',
})
export class NumberformatDirective {
  @Input() data: string;
  @Input() taxID: boolean = false;
  constructor(
    public ngControl: NgControl,
    private _el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('changes', ['$event'])
  ngOnChanges(event: SimpleChanges) {
    if (event['data'].currentValue) {
      const input = event['data'];
      let newVal = input.currentValue
        ? input.currentValue.replace(/\D/g, '')
        : '';
      // if (newVal.length <= 6) {
      //   newVal = newVal.substring(0, newVal.length - 1);
      // }
      if (
        typeof this.ngControl.name === 'string' &&
        ['facilitytaxId', 'taxId'].includes(this.ngControl.name)
      ) {
        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 2) {
          newVal = newVal.replace(/^(\d{0,2})/, '$1');
        } else if (newVal.length <= 9) {
          newVal = newVal.replace(/^(\d{0,2})(\d{0,7})/, '$1-$2');
          // } else if (newVal.length <= 9) {
          //   newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
        }
      } else {
        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 3) {
          newVal = newVal.replace(/^(\d{0,3})/, '($1)');
        } else if (newVal.length <= 6) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else if (newVal.length <= 10) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        }
      }
      // } else {
      //   newVal = newVal.substring(0, 10);
      //   newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      this.ngControl.control?.setValue(newVal);
      this.ngControl.control?.markAsTouched();
      this.ngControl.control?.markAsDirty();
      this.cdr.detectChanges();
    }
  }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
