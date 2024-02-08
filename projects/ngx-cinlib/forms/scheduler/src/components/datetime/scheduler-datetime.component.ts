import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Maybe } from 'ngx-cinlib/core';
import { DatetimeFormComponent } from 'ngx-cinlib/date/datetime-form';
import { AppValidators } from 'ngx-cinlib/forms/validators';
import { IconComponent } from 'ngx-cinlib/icons';
import { GridColumnDirective, GridRowComponent } from 'ngx-cinlib/layouts/grid-layout';
import { TooltipDirective } from 'ngx-cinlib/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { columns, lefthandColumns } from '../../constants/scheduler.constants';
import { SchedulerService } from '../../services/scheduler.service';
import { SchedulerOverviewComponent } from '../overview/scheduler-overview.component';

@Component({
  selector: 'cin-scheduler-datetime',
  templateUrl: './scheduler-datetime.component.html',
  styleUrls: ['./scheduler-datetime.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatetimeFormComponent,
    GridRowComponent,
    GridColumnDirective,
    IconComponent,
    MatButtonModule,
    ReactiveFormsModule,
    TooltipDirective,
  ]
})
export class SchedulerDatetimeComponent implements OnDestroy {

  public assignedColumns = lefthandColumns;
  public columns = columns;

  public minDate = new Date();
  public stepMinute = 15;

  public results = this.schedulerService.getResult();

  public form = this.fb.group({
    startDate: [undefined as Maybe<Date>],
    endDate: [undefined as Maybe<Date>],
  }, {
    validators: [AppValidators.dateBefore('startDate', 'endDate')]
  });

  private destroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private schedulerService: SchedulerService,
    private dialog: MatDialog,
  ) {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(values =>
        this.schedulerService.updatedInitSchedule(
          values.startDate,
          values.endDate,
          this.form.valid
        )
      );
  }

  public show(): void {
    this.dialog.open(SchedulerOverviewComponent, {
      data: this.schedulerService
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
