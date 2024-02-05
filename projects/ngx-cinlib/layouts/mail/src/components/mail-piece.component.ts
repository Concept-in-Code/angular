import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-mail-piece',
  templateUrl: './mail-piece.component.html',
  styleUrls: ['./mail-piece.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
  ]
})
export class MailPieceComponent {

  @Input()
  public mail?: Maybe<string>;

}
