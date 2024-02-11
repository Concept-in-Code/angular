import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent, SolidIconsType } from 'ngx-cinlib/icons';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-icon',
  template: `

    @if (input) {
      <cin-icon [icon]="['fas', input]"></cin-icon>
    }

  `,
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
  ]
})
export class TableCellIconComponent extends TableCellComponent<SolidIconsType> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }

}
