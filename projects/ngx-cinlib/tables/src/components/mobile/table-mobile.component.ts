import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { CellDirective } from '../../directives/table-cell.directive';
import { TableService } from '../../services/table.service';
import { TableActionsComponent } from '../actions/table-actions.component';
import { TablePaginatorComponent } from '../paginator/table-paginator.component';

@Component({
  selector: 'cin-table-mobile',
  templateUrl: './table-mobile.component.html',
  styleUrls: ['./table-mobile.component.scss'],
  standalone: true,
  animations: [
    trigger('expand', [
      state('closed', style({ height: '0', padding: '0' })),
      state('opened', style({ height: '*' })),
      transition('closed <=> opened', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
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

  public clickable = this.tableService.getClickable();

  public data = this.tableService.getData();

  public detailsComponent = this.tableService.getDetailsComponent();

  public expandRow?: Maybe<T>;

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