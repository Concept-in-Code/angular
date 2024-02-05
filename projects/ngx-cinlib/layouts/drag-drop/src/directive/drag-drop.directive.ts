import { Directive, TemplateRef } from '@angular/core';

@Directive({ 
  selector: '[cinDragDrop]',
  standalone: true,
})
export class DragDropDirective {
  
  constructor(
    public templateRef: TemplateRef<unknown>
  ) { }
}
