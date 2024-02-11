import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-color',
  template: `
    <div [ngStyle]="{
      'background-color': input,
      'height': '1.5rem',
      'width': '1.5rem',
      'border': '1px solid var(--color-border)',
      'border-radius': '.5rem',
    }">
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class TableCellColorComponent extends TableCellComponent<string> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }

}