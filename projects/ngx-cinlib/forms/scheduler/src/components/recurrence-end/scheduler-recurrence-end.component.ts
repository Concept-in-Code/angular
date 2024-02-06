import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Maybe } from 'ngx-cinlib/core';
import { RadioButtonComponent, RadioButtonInput } from 'ngx-cinlib/forms/radio-button';
import { AppValidators } from 'ngx-cinlib/forms/validators';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { GridColumnDirective, GridRowComponent } from 'ngx-cinlib/layouts/grid-layout';
import { Subject, takeUntil } from 'rxjs';
import { columns, lefthandColumns, numberColumns } from '../../constants/scheduler.constants';
import { SchedulerService } from '../../services/scheduler.service';
import { RecurrenceEnd } from '../../typings/scheduler';

@Component({
  selector: 'cin-scheduler-recurrence-end',
  templateUrl: './scheduler-recurrence-end.component.html',
  styleUrls: ['./scheduler-recurrence-end.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GridColumnDirective,
    GridRowComponent,
    I18nDirective,
    RadioButtonComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class SchedulerRecurrenceEndComponent implements OnDestroy {

  public form = this.fb.group({
    recurrenceEnd: [undefined as Maybe<RecurrenceEnd>],
    recurrenceUntil: [undefined as Maybe<Date>],
    recurrenceAfterTimes: [undefined as Maybe<number>, [Validators.min(0)]],
  }, {
    validators: [
      AppValidators.ifMatchValueOtherFilled('recurrenceEnd', 'until', 'recurrenceUntil'),
      AppValidators.ifMatchValueOtherFilled('recurrenceEnd', 'after', 'recurrenceAfterTimes'),
    ]
  });

  public columns = columns;
  public leftAssignedColumns = lefthandColumns;
  public numberAssignedColumns = numberColumns;

  public recurrenceEndOn: RadioButtonInput<RecurrenceEnd> = {
    label: 'on',
    value: 'until',
  };

  public recurrenceEndAfter: RadioButtonInput<RecurrenceEnd> = {
    label: 'after',
    value: 'after'
  };

  public date = new Date();

  private destroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private schedulerService: SchedulerService,
  ) {
    this.initEndChanged();
    this.endChanged();
    this.emit();
    this.schedulerService.addError('eitherAfterTimesOrEndDate');
  }

  private initEndChanged(): void {
    this.schedulerService.getInitRecurrenceEnd()
      .pipe(takeUntil(this.destroy))
      .subscribe(recurrenceEnd => {
        this.form.patchValue({
          recurrenceEnd
        });
        this.setDisableState(recurrenceEnd);
      });
  }

  private endChanged(): void {
    this.form.controls.recurrenceEnd.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(recurrenceEnd => this.setDisableState(recurrenceEnd));
  }

  private setDisableState(recurrenceEnd: Maybe<string>) {
    switch(recurrenceEnd) {
      case 'until':
        this.form.controls.recurrenceAfterTimes.disable();
        this.form.controls.recurrenceUntil.enable();
        break;
      case 'after':
        this.form.controls.recurrenceAfterTimes.enable();
        this.form.controls.recurrenceUntil.disable();
        break;
    }
  }

  private emit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(values => {
        if (this.form.valid) {
          if (values.recurrenceEnd === 'until'
              && values.recurrenceUntil) {
            this.schedulerService.setRecurrenceEndUntilDate(values.recurrenceUntil);
          } else if (values.recurrenceEnd === 'after'
              && values.recurrenceAfterTimes) {
            this.schedulerService.setRecurrenceEndAfterTimes(values.recurrenceAfterTimes)
          }
        } else {
          this.schedulerService.addError('eitherAfterTimesOrEndDate');
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
