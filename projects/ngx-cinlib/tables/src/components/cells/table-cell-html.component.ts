import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-html',
  template: `
    <span [innerHTML]='input'></span>
  `,
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class TableCellHtmlComponent extends TableCellComponent<string> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }

}
