import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, takeUntil } from 'rxjs';
import { IntervalFilter } from '../typings/interval';

@Component({
  selector: 'cin-interval-filter',
  templateUrl: './interval-filter.component.html',
  styleUrls: ['./interval-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    I18nDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})
export class IntervalFilterComponent implements OnInit, OnDestroy {

  @Input()
  public initValue?: IntervalFilter;

  @Input()
  public queryParam = true;

  @Input()
  public queryParamKey = 'interval';

  @Output()
  public valueChanged = new EventEmitter<IntervalFilter>();

  public control = new FormControl();

  public intervals: {
    label: string,
    value: IntervalFilter
  }[] = [
    {
      label: 'daily',
      value: IntervalFilter.Daily
    },
    {
      label: 'monthly',
      value: IntervalFilter.Monthly
    },
    {
      label: 'calendarWeeks',
      value: IntervalFilter.CalendarWeeks
    }
  ];

  private destroy = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.watchValueChange();
  }

  public ngOnInit(): void {
    if (this.initValue) {
      this.control.setValue(this.initValue, {
        emitEvent: false,
      });
    } else if (this.queryParam) {
      this.activatedRoute.queryParams
        .pipe(takeUntil(this.destroy))
        .subscribe(params => {
          const value = typeof params[this.queryParamKey] === 'string'
            ? [params[this.queryParamKey]]
            : params[this.queryParamKey];
  
          this.control.setValue(value, {
            emitEvent: false,
          });
        });
    }
  }

  private watchValueChange(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((interval: IntervalFilter) => {
        if (this.queryParam) {
          this.router.navigate([], {

            queryParams: {
              [this.queryParamKey || '']: interval
            },
            queryParamsHandling: 'merge',
          });
        }

        this.valueChanged.emit(interval);
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
