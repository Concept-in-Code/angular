import { Pipe, PipeTransform } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { Address } from '../typings/address';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  public transform(value?: Maybe<Address>): Maybe<string> {    
    return `
      ${value?.street} ${value?.houseNumber} <br>
      ${value?.postalCode} ${value?.place}
    `;
  }
}
