import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numberInput]',
  standalone: true
})
export class NumberInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const caretPosition = this.el.nativeElement.selectionStart;
  
    var newValue = initialValue.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
  
    const periodCount = newValue.split('.').length - 1;
    if (periodCount > 1) {
      const parts = newValue.split('.');
      newValue = parts[0] + '.' + parts.slice(1).join('');
    }
  
    this.el.nativeElement.value = newValue;
  
    const adjustedCaretPosition = caretPosition + (this.el.nativeElement.value.length - initialValue.length);
    this.el.nativeElement.setSelectionRange(adjustedCaretPosition, adjustedCaretPosition);
  }
  
}