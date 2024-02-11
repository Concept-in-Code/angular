import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, takeUntil, tap } from 'rxjs';
import { CellDirective } from '../../directives/table-cell.directive';
import { TableService } from '../../services/table.service';
import { TableActionsComponent } from '../actions/table-actions.component';
import { TablePaginatorComponent } from '../paginator/table-paginator.component';

@Component({
  selector: 'cin-table-mobile',
  templateUrl: './table-mobile.component.html',
  styleUrls: ['./table-mobile.component.scss'],
  standalone: true,
  imports: [
    CellDirective,
    CommonModule,
    I18nDirective,
    MatCardModule,
    MatDividerModule,
    TableActionsComponent,
    TablePaginatorComponent,
  ]
})
export class TableMobileComponent<T> implements AfterViewInit, OnDestroy {
  
  public actions = this.tableService.getActions();

  public columns = this.tableService.getColumns();

  public data = this.tableService.getData();

  public clickable = this.tableService.getClickable();

  @ViewChild('container')
  private container?: ElementRef;

  private destroy = new Subject<void>();

  @ViewChild(TablePaginatorComponent)
  public paginator!: TablePaginatorComponent;

  constructor(
    private tableService: TableService,
  ) { }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.tableService.setParams({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
      })),
      tap(() => this.container?.nativeElement?.scrollIntoView()),
      takeUntil(this.destroy),
    ).subscribe();
  }
;
  public rowClicked(row: T): void {
    this.tableService.setRowClicked(row);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}