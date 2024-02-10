import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';

@Component({
  selector: 'cin-sub-title',
  templateUrl: './sub-title.component.html',
  styleUrls: ['./sub-title.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
  ]
})
export class SubTitleComponent {

  @Input()
  public titleLabel?: Maybe<string>;

  @Input()
  public title?: Maybe<string>;

  @Input()
  public link?: string[];

}
