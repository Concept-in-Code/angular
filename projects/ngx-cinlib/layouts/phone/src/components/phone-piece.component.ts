import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-phone-piece',
  templateUrl: './phone-piece.component.html',
  styleUrls: ['./phone-piece.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
  ],
})
export class PhonePieceComponent {

  @Input()
  public phone?: Maybe<string>;

}
