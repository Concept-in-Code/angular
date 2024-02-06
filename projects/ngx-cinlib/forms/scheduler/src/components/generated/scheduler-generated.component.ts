import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { GridColumnDirective, GridRowComponent } from 'ngx-cinlib/layouts/grid-layout';
import { columns, lefthandColumns } from '../../constants/scheduler.constants';
import { SchedulerService } from '../../services/scheduler.service';
import { SchedulerOverviewComponent } from '../overview/scheduler-overview.component';

@Component({
  selector: 'cin-scheduler-generated',
  templateUrl: './scheduler-generated.component.html',
  styleUrls: ['./scheduler-generated.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridColumnDirective,
    GridRowComponent,
    I18nDirective,
    MatButtonModule,
  ]
})
export class SchedulerGeneratedComponent {

  public leftAssignedColumns = lefthandColumns;
  public columns = columns;

  constructor(
    private schedulerService: SchedulerService,
    private dialog: MatDialog,
  ) { }

  public reset(): void {
    this.schedulerService.reset();
  }

  public show(): void {
    this.dialog.open(SchedulerOverviewComponent);
  }

}
