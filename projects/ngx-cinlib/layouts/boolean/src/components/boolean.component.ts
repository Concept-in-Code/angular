import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.scss'],
  standalone: true,
  imports: [
    IconComponent,
  ]
})
export class BooleanComponent {
    
  @Input({ required: true })
  public set value(value: Maybe<any>) {
    this.booleanValue = this.convertToBoolean(value);
  }

  public booleanValue?: Maybe<boolean>;

  private convertToBoolean(value: Maybe<any>): Maybe<boolean> {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      return Boolean(value);
    }
  }

}
