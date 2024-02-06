import { Maybe, Period } from 'ngx-cinlib/core';

export type Recurrence = 'noRecurrence'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export type RecurrenceEnd = 'until'
  | 'after';

export type RecurrenceOptions = {
  initialSchedule?: Maybe<Period>,
  recurrence: Recurrence,
  interval: number,
  untilDate?: Maybe<Date>,
  repeatTimes?: Maybe<number>,
};

export type SchedulerError = 'startAndEndDateInvalid'
  | 'scheduleIntervalNotValid'
  | 'eitherAfterTimesOrEndDate'
