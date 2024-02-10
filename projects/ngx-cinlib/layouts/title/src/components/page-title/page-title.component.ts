import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';

@Component({
  selector: 'cin-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
  ]
})
export class PageTitleComponent {

  @Input()
  public title?: Maybe<string>;

  @Input()
  public titleLabel?: string;

}
