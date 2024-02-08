import { Maybe, Period } from 'ngx-cinlib/core';

export const monthPeriod = (date?: Maybe<Date>): Maybe<Period> | undefined => {
  if (date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    return {
      startDate: firstDay,
      endDate: lastDay,
    };
  }
  return undefined;
}

export const dayPeriod = (date?: Maybe<Date>): Maybe<Period> | undefined => {
  if (date) {
    const firstHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const lastHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return {
      startDate: firstHour,
      endDate: lastHour,
    };
  }
  return undefined;
}

export const toLocalDateTime = (date: Date): string => {
  return `${date.toISOString().substring(0, 11)}${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}`
}

export const doubleDigit = (number: number): string => {
  return number < 10 ? '0' + number : number.toString();
}