import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Maybe, collapse } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-filter-area',
  templateUrl: './filter-area.component.html',
  styleUrls: ['./filter-area.component.scss'],
  animations: [
    collapse()
  ],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    IconComponent,
    MatCardModule,
    MatButtonModule,
  ]
})
export class FilterAreaComponent {

  @Input()
  public filtersActive?: Maybe<boolean>;

  @Output()
  public filtersCleared = new EventEmitter<void>();

  public filtersCollapsed = true;

  public clearFilters(): void {
    this.filtersCleared.emit();
  }

}