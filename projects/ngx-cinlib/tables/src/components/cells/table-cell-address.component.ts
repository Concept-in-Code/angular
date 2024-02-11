/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Address, AddressPieceComponent } from 'ngx-cinlib/address';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-address',
  template: `
    @if (input) {
      <cin-address-piece
        [address]="input">
      </cin-address-piece>
    }
  `,
  standalone: true,
  imports: [
    AddressPieceComponent,
    CommonModule
  ]
})
export class TableCellAddressComponent extends TableCellComponent<Address> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }
}
