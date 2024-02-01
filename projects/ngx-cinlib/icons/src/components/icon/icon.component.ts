import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BrandIcon } from '../../typings/brand-icons';
import { RegularIcon } from '../../typings/regular-icons';
import { SolidIcon } from '../../typings/solid-icons';

@Component({
  selector: 'cin-icon',
  template: ``,
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class IconComponent implements OnChanges {

  @Input({ required: true })
  public icon!: SolidIcon | RegularIcon | BrandIcon;

  @Input()
  public size?: string = '1x';

  @HostBinding('innerHTML')
  public renderedIconHTML?: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  public ngOnChanges(): void {
    this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(
      `<span class="${this.icon[0]} fa-${this.icon[1]} fa-${this.size}"></span> \n`
    );
  }
}