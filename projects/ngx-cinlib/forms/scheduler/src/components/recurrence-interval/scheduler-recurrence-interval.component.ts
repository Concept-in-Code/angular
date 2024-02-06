import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { GridColumnDirective, GridRowComponent } from 'ngx-cinlib/layouts/grid-layout';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { columns, lefthandColumns, numberColumns } from '../../constants/scheduler.constants';
import { SchedulerService } from '../../services/scheduler.service';

@Component({
  selector: 'cin-scheduler-recurrence-interval',
  templateUrl: './scheduler-recurrence-interval.component.html',
  styleUrls: ['./scheduler-recurrence-interval.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridColumnDirective,
    GridRowComponent,
    I18nDirective,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class SchedulerRecurrenceIntervalComponent implements OnDestroy {

  public columns = columns;
  public leftAssignedColumns = lefthandColumns;
  public numberAssignedColumns = numberColumns;

  public control = new FormControl<number>(1, Validators.min(1));

  private destroy = new Subject<void>();

  constructor(
    private schedulerService: SchedulerService,
  ) {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(interval => this.schedulerService.updateInterval(interval, this.control.valid));
  }

  public get everyRecurrenceLabel(): Observable<string> {
    const isSingle = Number(this.control.value) === 1;

    return this.schedulerService.getRecurrenceType()
      .pipe(
        map(recurrenceType => {
          switch(recurrenceType) {
            case 'daily':
              return isSingle
                ? 'day'
                : 'days';
            case 'weekly':
              return isSingle
                ? 'week'
                : 'weeks';
            case 'monthly':
              return isSingle
                ? 'month'
                : 'months';
            case 'yearly':
              return isSingle
                ? 'year'
                : 'years';
            default:
              return '';
          }
        }),
      );
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
