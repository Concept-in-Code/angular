import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { AddressPipe } from '../pipes/address.pipe';
import { Address } from '../typings/address';

@Component({
  selector: 'cin-address-piece',
  templateUrl: './address-piece.component.html',
  styleUrls: ['./address-piece.component.scss'],
  standalone: true,
  imports: [
    AddressPipe,
    CommonModule,
    IconComponent,
    I18nDirective,
  ]
})
export class AddressPieceComponent {

  @Input()
  public address?: Maybe<Address>;

  @Input()
  public link?: Maybe<string>;

  @Output()
  public addressClicked = new EventEmitter<Maybe<Address>>();

  public onClick(): void {
    if (this.address) {
      this.addressClicked.emit(this.address);
    }
  }
}
