import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Maybe, PageableList } from 'ngx-cinlib/core';
import { Observable, Subject, isObservable, takeUntil } from 'rxjs';
import { TablePaginatorService } from '../services/table-paginator.service';
import { TableService } from '../services/table.service';
import { Column } from '../typings/column';
import { RowAction } from '../typings/row-action';
import { SortPaginate } from '../typings/sort-paginate';
import { TableDesktopComponent } from './desktop/table-desktop.component';
import { TableMobileComponent } from './mobile/table-mobile.component';

@Component({
  selector: 'cin-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableDesktopComponent,
    TableMobileComponent,
  ],
  providers: [
    TableService,
    {
      provide: MatPaginatorIntl,
      useClass: TablePaginatorService
    }
  ]
})
export class TableComponent<T> implements OnInit, OnDestroy {

  @Input()
  public set actions(actions: RowAction<T>[]) {
    this.tableService.setActions(actions);
  }

  @Input()
  public set columns(columns: Column<T>[]) {
    this.tableService.setColumns(columns);
  }

  @Input()
  public set data(data: Observable<Maybe<PageableList<T>>> | Maybe<PageableList<T>>) {
    isObservable(data)
      ? data
        .pipe(takeUntil(this.destroy))
        .subscribe(data => this.tableService.setData(data))
      : this.tableService.setData(data);
  }

  @Input()
  public set initParams(initParams: SortPaginate) {
    this.tableService.setParams(initParams);
  }

  @Input()
  public set queryParams(queryParams: boolean) {
    this.tableService.setUseQueryParams(queryParams);
  }

  @Output()
  public sortPaginate = new EventEmitter<SortPaginate>();

  @Output()
  public rowClicked = new EventEmitter<Maybe<T>>();

  @ContentChild('details')
  public set detailsComponent(component: TemplateRef<any>) {
    this.tableService.setDetailsComponent(component);
  }

  private destroy = new Subject<void>();

  constructor(
    private tableService: TableService,
  ) { }

  public ngOnInit(): void {

    this.tableService.getParams()
      .pipe(takeUntil(this.destroy))
      .subscribe(params => this.sortPaginate.emit(params));

    this.tableService.getRowClicked()
      .pipe(takeUntil(this.destroy))
      .subscribe(row => row && this.rowClicked.emit(row));

    this.tableService.setObserved(this.rowClicked.observed);
  }

  public ngOnDestroy(): void {
    //TODO: This has side effects when switchin from mobile to desktop and vice versa
    // If not called, sort props mix up for different tables
    // this.tableService.dispatch(TableActions.resetTable());

    this.destroy.next();
    this.destroy.complete();
  }
} 