import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category, CategoryPieceComponent } from 'ngx-cinlib/layouts/category';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-address',
  template: `
    <cin-category-piece *ngIf="input"
      [category]="input">
    </cin-category-piece>
  `,
  standalone: true,
  imports: [
    CommonModule,
    CategoryPieceComponent
  ]
})
export class TableCellCategoryComponent extends TableCellComponent<Category> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }
}
