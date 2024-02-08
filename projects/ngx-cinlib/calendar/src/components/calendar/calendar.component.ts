import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Maybe, Period } from 'ngx-cinlib/core';
import { dayPeriod, monthPeriod } from 'ngx-cinlib/date/utils';
import { Subject, takeUntil } from 'rxjs';
import { CalendarService } from '../../services/calendar.service';
import { CalendarQueryDefinition, CalendarQueryParams } from '../../typings/calendar';
import { CalendarHeaderComponent } from '../header/calendar-header.component';

@Component({
  selector: 'cin-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  providers: [CalendarService],
  imports: [
    CalendarHeaderComponent,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class CalendarComponent implements OnInit, OnChanges, OnDestroy {
  
  @Input()
  public dates?: Maybe<Date[]>;

  @Input()
  public queryParams = true;
  
  @Input()
  public startAt = new Date();

  @Output()
  public daySelected = new EventEmitter<Period>();

  @Output()
  public monthSelected = new EventEmitter<Period>();

  @ViewChild(MatCalendar)
  private calendar?: MatCalendar<Date>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dateFilter = (_: Date): boolean => { return false; }

  public header = CalendarHeaderComponent;
  
  private destroy = new Subject<void>();
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private calendarService: CalendarService,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.watchQueryParams();
    this.watchMonthSelection();
    this.watchDateFilter();
  }

  public ngOnChanges(): void {
    this.watchDateFilter();
  }

  private watchQueryParams(): void {
    if (this.queryParams) {
      this.activatedRoute.queryParams
        .pipe(takeUntil(this.destroy))
        .subscribe((params: CalendarQueryParams) => {
          if (params[CalendarQueryDefinition.selectedMonth]) {
            this.startAt = new Date(params[CalendarQueryDefinition.selectedMonth]);
            
            if (this.calendar) {
              this.calendar.activeDate = new Date(params[CalendarQueryDefinition.selectedMonth]);
              this.calendar?.updateTodaysDate();
            }

            this.monthSelected.emit(monthPeriod(this.startAt) as Period);
          }

          if (params[CalendarQueryDefinition.selectedDay]) {
            this.daySelected.emit(dayPeriod(new Date(params[CalendarQueryDefinition.selectedDay])) as Period);
          }
        });
    }
  }

  private watchMonthSelection(): void {
    this.monthSelected.emit(monthPeriod(this.startAt) as Period);
    this.calendarService.selectedMonth()
      .pipe(takeUntil(this.destroy))
      .subscribe(month => {
        this.monthSelected.emit(month);
        if (this.queryParams) {
          this.router.navigate([], {
            
            queryParams: {
              [CalendarQueryDefinition.selectedMonth]: month.startDate.toISOString(),
            },
            queryParamsHandling: 'merge'
          });
        }
      });
  }

  private watchDateFilter(): void {
    // This overrrides the dateFilter to refresh date filter async
    // see: https://stackoverflow.com/questions/59762201/how-to-have-material-calenders-date-picker-filter-method-work-with-observables
    this.dateFilter = (calendarDate: Date) =>
      !!this.dates?.some(date => date.toDateString() === calendarDate.toDateString())
  }
  public selectedChange(date: Maybe<Date>): void {
    this.daySelected.emit(dayPeriod(date) as Period);

    if (this.queryParams) {
      this.router.navigate([], {
        
        queryParams: {
          [CalendarQueryDefinition.selectedDay]: date?.toISOString(),
        },
        queryParamsHandling: 'merge'
      });
    }
  }
  
  public ngOnDestroy(): void {
    this.router.navigate([], {
      queryParams: {
        [CalendarQueryDefinition.selectedDay]: null,
        [CalendarQueryDefinition.selectedMonth]: null,
      },
      queryParamsHandling: 'merge',
    }).then(() => window.scrollTo(0,0));

    this.destroy.next();  
    this.destroy.complete();
  }

}