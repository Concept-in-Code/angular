import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[cinHtml]',
  standalone: true
})
export class HtmlDirective implements AfterViewInit, OnDestroy {

  private destroy = new Subject<void>();

  constructor(
    private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.el.nativeElement.innerHTML = `
      <div>
        ${this.el.nativeElement.innerText}
      </div>
    `;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}