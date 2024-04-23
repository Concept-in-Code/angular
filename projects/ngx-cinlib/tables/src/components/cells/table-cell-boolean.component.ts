import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BooleanComponent } from 'ngx-cinlib/layouts/boolean';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-boolean',
  template: `
    <cin-boolean [value]="input"></cin-boolean>
  `,
  standalone: true,
  imports: [
    BooleanComponent,
    CommonModule,
  ]
})
export class TableCellBooleanComponent extends TableCellComponent<boolean> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }
}