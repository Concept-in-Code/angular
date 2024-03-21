import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Maybe, collapse } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { ConfirmService, ConfirmType } from 'ngx-cinlib/modals/confirm';
import { TooltipDirective } from 'ngx-cinlib/tooltip';
import { take } from 'rxjs';

@Component({
  selector: 'cin-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  standalone: true,
  animations: [
    collapse()
  ],
  imports: [
    CommonModule,
    IconComponent,
    MatButtonModule,
    MatCardModule,
    I18nDirective,
    TooltipDirective,
  ]
})
export class AccordionComponent {
  
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

  @Input()
  public deletable?: Maybe<boolean> = true;

  @Input()
  public disabled?: Maybe<boolean> = true;

  @Output()
  public deleted = new EventEmitter<void>();

  constructor(
    private confirmService: ConfirmService,
  ) {}

  public changeExpansion(): void {
    if (this.expandable) {
      this.expanded = !this.expanded;
    }
  }

  public onDelete() {
    this.confirmService
      .confirm({ type: ConfirmType.Delete})
      .pipe(take(1))
      .subscribe(confirmed => {
        if (confirmed) {
          this.deleted.emit();
        }
      });
  }

}
