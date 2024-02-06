import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { GridColumnDirective, GridRowComponent } from 'ngx-cinlib/layouts/grid-layout';
import { Subject, takeUntil } from 'rxjs';
import { columns, lefthandColumns } from '../../constants/scheduler.constants';
import { SchedulerService } from '../../services/scheduler.service';
import { Recurrence, } from '../../typings/scheduler';

@Component({
  selector: 'cin-scheduler-recurrence-type',
  templateUrl: './scheduler-recurrence-type.component.html',
  styleUrls: ['./scheduler-recurrence-type.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridColumnDirective,
    GridRowComponent,
    I18nDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ]
})
export class SchedulerRecurrenceTypeComponent implements OnDestroy {

  public columns = columns;
  public leftAssignedColumns = lefthandColumns;

  public results = this.schedulerService.getResult();

  public control = new FormControl<Maybe<Recurrence>>('noRecurrence');

  public recurrences: Recurrence[] = [
    'noRecurrence',
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  private destroy = new Subject<void>();

  constructor(
    private schedulerService: SchedulerService,
  ) {
    this.setDisableState();
    this.emit();
  }
  
  private setDisableState(): void {
    this.schedulerService.getInitSchedule()
      .pipe(takeUntil(this.destroy))
      .subscribe(initSchedule => {
        initSchedule
          ? this.control.enable()
          : this.control.disable();

        this.control.patchValue('noRecurrence');
        this.schedulerService.setRecurrenceType('noRecurrence');
      }
      );
  }

  private emit(): void {
    this.control.valueChanges
    .pipe(takeUntil(this.destroy))
    .subscribe(value => {
      if (this.control.valid && value) {
        this.schedulerService.setRecurrenceType(value);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
