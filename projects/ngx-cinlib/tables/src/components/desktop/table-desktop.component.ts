/* eslint-disable @typescript-eslint/no-explicit-any */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, delay, merge, take, takeUntil, tap } from 'rxjs';
import { CellDirective } from '../../directives/table-cell.directive';
import { TableService } from '../../services/table.service';
import { TableActionsComponent } from '../actions/table-actions.component';
import { TablePaginatorComponent } from '../paginator/table-paginator.component';

@Component({
  selector: 'cin-table-desktop',
  templateUrl: './table-desktop.component.html',
  styleUrls: ['./table-desktop.component.scss'],
  standalone: true,
  animations: [
    trigger('expand', [
      state('closed', style({ height: '0', padding: '0', overflow: 'hidden', display: 'block' })),
      state('opened', style({ height: '*', overflow: '*', display: '*' })),
      transition('closed <=> opened', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  imports: [
    CellDirective,
    CommonModule,
    I18nDirective,
    MatCardModule,
    MatSortModule,
    NgTemplateOutlet,
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

  public detailsComponent = this.tableService.getDetailsComponent();

  public expandRow?: Maybe<T>;

  public initParams = this.tableService.getParams();

  public withFooter = this.tableService.getWithFooter();

  @ViewChild(TablePaginatorComponent)
  public paginator?: TablePaginatorComponent;

  @ViewChild(MatSort)
  public sort!: MatSort;

  private destroy = new Subject<void>();

  constructor(
    private tableService: TableService,
  ) { }

  public ngAfterViewInit(): void {

    // Timeout fixes ERROR Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError
    // see: https://blog.angular-university.io/angular-debugging/
    setTimeout(() => {
      this.tableService.getParams()
        .pipe(take(1))
        .subscribe(initParams => {
          this.sort.sort({
            id: initParams?.sort ?? '',
            start: initParams?.dir as SortDirection ?? '',
            disableClear: true
          });
        });

      this.sort.sortChange
        .pipe(
          delay(0),
          takeUntil(this.destroy)
        )
        .subscribe(() =>  {
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }
        });

      if (this.paginator && this.sort) {
        merge(this.sort.sortChange, this.paginator.page).pipe(
          delay(0),
          tap(() => this.tableService.setParams({
            dir: this.sort.direction,
            sort: this.sort.active,
            page: this.paginator?.pageIndex,
            size: this.paginator?.pageSize,
          })),
          takeUntil(this.destroy),
        ).subscribe();
      }
    });
  }

  public rowClicked(row: T): void {
    this.tableService.getDetailsComponent()
      .pipe(take(1))
      .subscribe(expandComponent => expandComponent
        ? (this.expandRow = this.expandRow === row ? undefined : row)
        : this.tableService.setRowClicked(row)
      )
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
