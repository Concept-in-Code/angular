/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, merge, take, takeUntil, tap } from 'rxjs';
import { CellDirective } from '../../directives/table-cell.directive';
import { TableService } from '../../services/table.service';
import { TableActionsComponent } from '../actions/table-actions.component';
import { TablePaginatorComponent } from '../paginator/table-paginator.component';

@Component({
  selector: 'cin-table-desktop',
  templateUrl: './table-desktop.component.html',
  styleUrls: ['./table-desktop.component.scss'],
  standalone: true,
  imports: [
    CellDirective,
    CommonModule,
    I18nDirective,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    TableActionsComponent,
    TablePaginatorComponent,
  ]
})
export class TableDesktopComponent<T> implements AfterViewInit, OnDestroy {

  public actions = this.tableService.getActions();

  public clickable = this.tableService.getClickable();

  public columns = this.tableService.getColumns();

  public data = this.tableService.getData();

  public displayedColumns = this.tableService.getDisplayColumns();

  public initParams = this.tableService.getParams();

  @ViewChild(TablePaginatorComponent)
  public paginator!: TablePaginatorComponent;

  @ViewChild(MatSort)
  public sort!: MatSort;

  private destroy = new Subject<void>();

  constructor(
    private tableService: TableService,
  ) { }

  public ngAfterViewInit(): void {
    this.tableService.getParams()
      .pipe(take(1))
      .subscribe(initParams => {
        this.sort.sort({
          id: initParams?.sort ?? '',
          start: initParams?.dir as SortDirection ?? '',
          disableClear: true
        });
      });

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.tableService.setParams({
        dir: this.sort.direction,
        sort: this.sort.active,
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
      })),
      takeUntil(this.destroy),
    ).subscribe();
  }

  public rowClicked(row: T): void {
    this.tableService.setRowClicked(row);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete(); 
  }

}