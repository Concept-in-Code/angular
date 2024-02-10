import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent, SolidIconsType } from 'ngx-cinlib/icons';
@Component({
  selector: 'cin-details-title',
  templateUrl: './details-title.component.html',
  styleUrls: ['./details-title.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    RouterModule,
  ]
})
export class DetailsTitleComponent {

  @Input()
  public title?: Maybe<string>;

  @Input()
  public titleLabel?: Maybe<string>;

  @Input()
  public link?: Maybe<string[]>;

  @Input()
  public linkLabel?: Maybe<string>;

  @Input()
  public linkIcon?: SolidIconsType

}
