import { Injectable } from '@angular/core';
import { Maybe, Period } from 'ngx-cinlib/core';
import { FeedbackService, FeedbackType } from 'ngx-cinlib/modals/feedback';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recurrence, RecurrenceEnd, SchedulerError } from '../typings/scheduler';
import { addError, calculateSchedules, removeError } from '../utils/scheduler.utils';

@Injectable()
export class SchedulerService {

  private errors = new BehaviorSubject<Maybe<SchedulerError[]>>(undefined);

  private generationPerformed = new BehaviorSubject<boolean>(false);

  private initSchedule = new BehaviorSubject<Maybe<Period>>(undefined);

  private initRecurrenceEnd = new BehaviorSubject<RecurrenceEnd>('until');
  private recurrenceEndAfterTimes = new BehaviorSubject<Maybe<number>>(undefined);
  private recurrenceEndUntilDate = new BehaviorSubject<Maybe<Date>>(undefined);
  private recurrenceInterval = new BehaviorSubject<Maybe<number>>(1);
  private recurrenceType = new BehaviorSubject<Maybe<Recurrence>>('noRecurrence');

  private result = new BehaviorSubject<Maybe<Period[]>>(undefined);

  constructor(
    private feedbackService: FeedbackService,
  ) { }

  public updatedInitSchedule(
    startDate: Maybe<Date>,
    endDate: Maybe<Date>,
    formValid: boolean
  ): void {
    if (startDate && endDate && formValid) {
      const initSchedule = {
        startDate: startDate,
        endDate: endDate
      };

      let result: Period[] = [];
      if (this.result.value) {
        result = this.result.value.filter(entry => !(entry.startDate === this.initSchedule.value?.startDate
          && entry.endDate === this.initSchedule.value?.endDate));
      }

      this.removeError('startAndEndDateInvalid');
      this.setResult([...result, initSchedule]);
      this.setInitSchedule(initSchedule);
    } else {
      this.addError('startAndEndDateInvalid')
      this.setInitSchedule(undefined);
    }
  }

  public updateInterval(interval: Maybe<number>, formValid: boolean): void {
    if (formValid) {
      this.setRecurrenceInterval(interval);
      this.removeError('scheduleIntervalNotValid');
    } else {
      this.addError('scheduleIntervalNotValid');
    }
  }

  public generateResult(): void {
    this.setResult([...(this.result.value ?? []), ...calculateSchedules({
      initialSchedule: this.initSchedule.value,
      interval: (this.recurrenceInterval.value ?? 1),
      recurrence: (this.recurrenceType.value ?? 'daily'),
      repeatTimes: this.recurrenceEndAfterTimes.value,
      untilDate: this.recurrenceEndUntilDate.value,
    })].sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));

    this.setGenerationPerformed(true);
    this.feedbackService.open({
      type: FeedbackType.Success,
      labelMessage: 'successfullyGeneratedSchedules',
      labelAction: 'createNewSchedules'
    })

  }

  public delete(index: number): void {
    if (this.result.value) {
      const result = [...this.result.value];
  
      result.splice(index, 1);

      result?.length
        ? this.setResult(result)
        : this.reset()
    }
  }

  public reset(): void {
    this.setInitSchedule(undefined);

    this.setRecurrenceType('noRecurrence');
    this.setRecurrenceInterval(undefined);
    this.setRecurrenceEndAfterTimes(undefined);
    this.setRecurrenceEndUntilDate(undefined);

    this.setErrors(undefined);
    this.setGenerationPerformed(false);
  }

  public getErrors(): Observable<Maybe<SchedulerError[]>> {
    return this.errors.asObservable();
  }

  public setErrors(value: Maybe<SchedulerError[]>): void {
    this.errors.next(value);
  }

  public addError(value: SchedulerError) {
    this.setErrors(addError(this.errors.value, value));
  }

  public removeError(value: SchedulerError) {
    this.setErrors(removeError(this.errors.value, value));
  }

  public getGenerationPerformed(): Observable<boolean> {
    return this.generationPerformed.asObservable();
  }

  public setGenerationPerformed(value: boolean): void {
    this.generationPerformed.next(value);
  }

  public getInitSchedule(): Observable<Maybe<Period>> {
    return this.initSchedule.asObservable();
  }

  public setInitSchedule(value: Maybe<Period>): void {
    this.initSchedule.next(value);
  }

  public getRecurrenceType(): Observable<Maybe<Recurrence>> {
    return this.recurrenceType.asObservable();
  }

  public setRecurrenceType(value: Recurrence): void {
    this.recurrenceType.next(value);
  }

  public setRecurrenceInterval(value: Maybe<number>): void {
    this.recurrenceInterval.next(value);
  }

  public setRecurrenceEndAfterTimes(value: Maybe<number>): void {
    this.recurrenceEndAfterTimes.next(value);
    this.removeError('eitherAfterTimesOrEndDate');
  }

  public setRecurrenceEndUntilDate(value: Maybe<Date>): void {
    this.recurrenceEndUntilDate.next(value);
    this.removeError('eitherAfterTimesOrEndDate');
  }

  public getInitRecurrenceEnd(): Observable<RecurrenceEnd> {
    return this.initRecurrenceEnd.asObservable();
  }

  public getResult(): Observable<Maybe<Period[]>> {
    return this.result.asObservable();
  }

  public setResult(value: Maybe<Period[]>): void {
    this.result.next(value);
  }
 
}