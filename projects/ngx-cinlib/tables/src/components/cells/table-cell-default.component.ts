/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-default',
  template: `
    @if (editMode) {
      <!-- EDIT AREA -->
      <mat-form-field
        appearance="outline"
        [hideRequiredMarker]="true">
        <mat-label [i18nLabel]="column?.label"></mat-label>
        <input matInput [formControl]="control">
      </mat-form-field>

    } @else {
      <!-- DISPLAY AREA -->
      <span> {{ input ?? ' - ' }}</span>
    }
  `,
  styles: `
    :host {
      overflow-wrap: break-word
    }
  `,
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class TableCellDefaultComponent extends TableCellComponent<any> {

  constructor(
    tableService: TableService,
  ) { super(tableService); }

}
