import { Directive, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';

@Directive({
  selector: '[cinAssignColumns]',
  standalone: true,
})
export class GridColumnDirective {

  @Input()
  public cinAssignColumns?: Maybe<number>;
  
}
