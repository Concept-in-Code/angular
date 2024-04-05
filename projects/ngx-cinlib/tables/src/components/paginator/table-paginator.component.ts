import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';
import { ExportDataButtonComponent } from '../button/export-data-button.component';

@Component({
  selector: 'cin-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    IconComponent,
    ExportDataButtonComponent
  ]
})
export class TablePaginatorComponent {

  @ViewChild(MatPaginator)
  public paginator!: MatPaginator;

  public _length?: Maybe<number>;

  @Input()
  public set length(length: Maybe<number> | undefined) {
    this._length = length;
  }

  public get length(): Maybe<number> {
    return this.paginator.length;
  }

  public _pageIndex?: Maybe<number>;

  @Input()
  public set pageIndex(pageIndex: Maybe<number> | undefined) {
    this._pageIndex = pageIndex;
  }

  public get pageIndex(): Maybe<number> {
    return this.paginator.pageIndex;
  }

  public _pageSize?: Maybe<number>;

  @Input()
  public set pageSize(pageSize: Maybe<number> | undefined) {
    this._pageSize = pageSize;
  }

  public get pageSize(): Maybe<number> {
    return this.paginator.pageSize;
  }

  public _pageSizeOption = [5, 10, 25, 100];

  @Input()
  public set pageSizeOption(pageSizeOption: number[]) {
    this._pageSizeOption = pageSizeOption;
  }

  public get pageSizeOption(): Maybe<number[]> {
    return this.paginator.pageSizeOptions;
  }

  @Output()
  public page = new EventEmitter<PageEvent>;

  public updatePage(event: PageEvent): void {
    this.page.emit(event);
  }
}