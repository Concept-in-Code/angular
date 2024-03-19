import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cinExtendedSearch]',
  standalone: true
})
export class ExtendedSearchDirective {

  constructor(
    public templateRef: TemplateRef<unknown>
  ) {}
}