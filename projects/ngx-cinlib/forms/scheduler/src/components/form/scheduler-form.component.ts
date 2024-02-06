import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Maybe, Period } from 'ngx-cinlib/core';
import { Subject, takeUntil } from 'rxjs';
import { SchedulerService } from '../../services/scheduler.service';
import { SchedulerDatetimeComponent } from '../datetime/scheduler-datetime.component';
import { SchedulerErrorsComponent } from '../errors/scheduler-errors.component';
import { SchedulerExecuteComponent } from '../execute/scheduler-execute.component';
import { SchedulerGeneratedComponent } from '../generated/scheduler-generated.component';
import { SchedulerRecurrenceEndComponent } from '../recurrence-end/scheduler-recurrence-end.component';
import { SchedulerRecurrenceIntervalComponent } from '../recurrence-interval/scheduler-recurrence-interval.component';
import { SchedulerRecurrenceTypeComponent } from '../recurrence-type/scheduler-recurrence-type.component';

@Component({
  selector: 'cin-scheduler-form',
  templateUrl: './scheduler-form.component.html',
  styleUrls: ['./scheduler-form.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SchedulerFormComponent),
      multi: true
    },
    SchedulerService,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    SchedulerDatetimeComponent,
    SchedulerErrorsComponent,
    SchedulerExecuteComponent,
    SchedulerGeneratedComponent,
    SchedulerRecurrenceEndComponent,
    SchedulerRecurrenceIntervalComponent,
    SchedulerRecurrenceTypeComponent,
  ],
})
export class SchedulerFormComponent implements ControlValueAccessor {

  public generationPerformed = this.schedulerService.getGenerationPerformed();

  public recurrenceType = this.schedulerService.getRecurrenceType();

  public onChange?: (value: Maybe<Period[]>) => void;
  public onTouched?: () => void;

  private destroy = new Subject<void>();

  constructor(
    private schedulerService: SchedulerService,
  ) {
    this.schedulerService.getResult()
      .pipe(takeUntil(this.destroy))
      .subscribe(result => this.onChange?.(result))
  }

  public writeValue(value: Maybe<Period[]>): void {
    this.schedulerService.setResult(value)
  }

  public registerOnChange(onChange: (value: Maybe<Period[]>) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

}
