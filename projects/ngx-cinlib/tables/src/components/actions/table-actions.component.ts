import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent, SolidIconsType } from 'ngx-cinlib/icons';
import { AuthService } from 'ngx-cinlib/security';
import { TooltipDirective } from 'ngx-cinlib/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { TableService } from '../../services/table.service';
import { RowAction, RowActionComponent, RowActionComponentInput, RowCustomAction } from '../../typings/row-action';

@Component({
  selector: 'cin-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    MatButtonModule,
    NgComponentOutlet,
    TooltipDirective,
  ]
})
export class TableActionsComponent<T> implements OnDestroy {

  @Input({ required: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public row?: Maybe<any>;

  public actions = this.tableService.getActions();

  public inlineEditAction?: Maybe<RowCustomAction<T>>;
  public inlineEditActive = this.tableService.getInlineEditActive();
  public inlineEditRow = this.tableService.getInlineEditRow();

  private destroy = new Subject<void>();

  constructor(
    public authService: AuthService,
    private tableService: TableService
  ) {

    this.tableService.getInlineEditAction()
      .pipe(takeUntil(this.destroy))
      .subscribe(action => this.inlineEditAction = action);
  }

  public actionComponent(action: string | RowActionComponent<T> | RowCustomAction<T>): Maybe<RowActionComponentInput> {
    return typeof action === 'function'
      ? (action as RowActionComponent<T>)?.(this.row)
      : undefined;
  }

  public callback(action: RowAction<T>): void {
    (action as RowCustomAction<T>).callback?.(this.row)
  }

  public icon(action: RowAction<T>): SolidIconsType {
    return (action as RowCustomAction<T>).icon;
  }

  public isDisabled(action: RowAction<T>): boolean {
    return !!(action as RowCustomAction<T>)?.disable?.(this.row);
  }

  public hasPrivileges(action: RowAction<T>): boolean {
    const privileges = (action as RowCustomAction<T>)?.privileges;
    return privileges
      ? this.authService.hasAnyPrivileges(privileges)
      : true;
  }

  public tooltip(action: RowAction<T>): Maybe<string> {
    return (action as RowCustomAction<T>).tooltipLabel;
  }

  public enableInlineEdit(): void {
    this.tableService.enableInlineEdit(this.row);
  }

  public saveInlineEdit(): void {
    this.tableService.rowEdited();
  }

  public cancelInlineEdit(): void {
    this.tableService.cancelInlineEdit();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}