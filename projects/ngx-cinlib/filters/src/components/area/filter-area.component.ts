import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { collapse } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { ExtendedSearchDirective } from '../../directives/extended-search.directive';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'cin-filter-area',
  templateUrl: './filter-area.component.html',
  styleUrls: ['./filter-area.component.scss'],
  standalone: true,
  animations: [
    collapse()
  ],
  imports: [
    CommonModule,
    ExtendedSearchDirective,
    I18nDirective,
    IconComponent,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
  ]
})
export class FilterAreaComponent {

  @Input()
  public filtersActive = this.filterService.filtersActive();

  @Output()
  public filtersCleared = new EventEmitter<void>();

  @ContentChild(ExtendedSearchDirective)
  public extendedSearch?: ExtendedSearchDirective;

  public extendedCollapsed = true;
  public filtersCollapsed = true;

  constructor(
    public filterService: FilterService
  ) {}

  public clearFilters(): void {
    this.filtersCleared.emit();
    this.filterService.clearFilters();
  }

}