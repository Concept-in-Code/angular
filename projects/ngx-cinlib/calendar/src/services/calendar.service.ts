import { Injectable } from '@angular/core';
import { Period } from 'ngx-cinlib/core';
import { monthPeriod } from 'ngx-cinlib/date/utils';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CalendarService {

  private month = new Subject<Period>();

  public selectedMonth(): Observable<Period> {
    return this.month.asObservable();
  }

  public select(date: Date): void {
    this.month.next(monthPeriod(date) as Period);
  }

}
