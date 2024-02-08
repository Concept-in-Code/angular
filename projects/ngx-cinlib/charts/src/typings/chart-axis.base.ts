import { Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { Color, ScaleType } from 'cinlib-charts';
import { TranslationService } from 'ngx-cinlib/i18n';
import { Observable, Subject, isObservable, takeUntil } from 'rxjs';
import { chartsDefaultColor } from '../constants/chart.constants';
import { ChartAction } from './chart-actions';

@Directive()
export abstract class AxisChart implements OnChanges, OnDestroy {

  @Input()
  public actions?: ChartAction[];

  @Input()
  public set colors(colors: string[]) {
    this.schemeCustom = { ...this.schemeDefault,
      domain: colors.map(color => color.startsWith('--')
        ? getComputedStyle(document.documentElement)
          .getPropertyValue(color as string)
        : color
      )
    };
  }
  
  @Input()
  public set data(data: Observable<unknown> | unknown) {
    isObservable(data)
      ? data
        .pipe(takeUntil(this.destroy))
        .subscribe(results => this.results = results)
      : (this.results = data);
  }

  @Input()
  public showGridLines = false;

  @Input()
  public set xAxisLabel(label: string) {
    this.translationService.getLabel(label)
      .subscribe(translation => {
        if (translation) {
          this._xAxisLabel = translation;
        }
      })
  }

  public _xAxisLabel = '';

  @Input()
  public set yAxisLabel(label: string) {
    this.translationService.getLabel(label)
      .subscribe(translation => {
        if (translation) {
          this._yAxisLabel = translation;
        }
      })
  }

  @Input()
  public _yAxisLabel = '';

  @Input()
  public titleLabel?: string;

  @Input()
  public title?: string;

  @Input()
  public xAxis = true;

  @Input()
  public yAxis = true;

  public get scheme(): Color {
    return this.schemeCustom ?? this.schemeDefault;
  }

  public schemeCustom?: Color;

  public schemeDefault: Color = {
    group: ScaleType.Time,
    name: 'colors',
    selectable: true,
    domain: []
  };

  public showXAxisLabel = false;

  public showYAxisLabel = false;

  public results: unknown;

  protected destroy = new Subject<void>();

  constructor(
    protected translationService: TranslationService) {
      this.schemeDefault = {
        ...this.schemeDefault,
          domain: chartsDefaultColor
            .map(color => getComputedStyle(document.documentElement)
              .getPropertyValue(color as string)
            ),
      }
  }

  public ngOnChanges(): void {
    this.showXAxisLabel = !!this._xAxisLabel;
    this.showYAxisLabel = !!this._yAxisLabel;
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}