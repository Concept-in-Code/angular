import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from 'ngx-cinlib/icons';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-boolean',
  template: `
    <cin-icon [icon]="input 
      ? ['fas', 'check'] 
      : ['fas', 'xmark']">
    </cin-icon>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IconComponent
  ]
})
export class TableCellBooleanComponent extends TableCellComponent<boolean> {

  constructor(
    store: TableService,
  ) { super(store); }
}