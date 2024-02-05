import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { LocalDatePipe } from 'ngx-cinlib/date/pipes';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-date-piece',
  templateUrl: './date-piece.component.html',
  styleUrls: ['./date-piece.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    LocalDatePipe,
  ]
})
export class DatePieceComponent {

  @Input()
  public date?: Maybe<string>;

  @Input()
  public dateTime? = true;

  @Input()
  public label = 'date';

}
