import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-drag-drop-element',
  templateUrl: './drag-drop-element.component.html',
  styleUrls: ['./drag-drop-element.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective
  ]
})
export class DragDropElementComponent {
  
  @Input()
  public title?: Maybe<string>;

  @Input()
  public titleLabel?: Maybe<string>;

  @Input()
  public subTitle?: Maybe<string>;

  @Input()
  public subTitleLabel?: Maybe<string>;

  @Input()
  public expanded: Maybe<boolean> = false;

  @Input()
  public expandable: Maybe<boolean> = true;

  @ViewChild('template')
  public template!: TemplateRef<unknown>;

  public changeExpansion(): void {
    if (this.expandable) {
      this.expanded = !this.expanded;
    }
  }

}
