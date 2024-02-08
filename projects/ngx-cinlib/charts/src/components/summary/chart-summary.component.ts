import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { ChartAction } from '../../typings/chart-actions';
import { ChartActionsComponent } from '../actions/chart-actions.component';

@Component({
  selector: 'cin-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.scss'],
  standalone: true,
  imports: [
    ChartActionsComponent,
    CommonModule,
    I18nDirective,
    MatCardModule,
  ]
})
export class ChartSummaryComponent {

  @Input()
  public actions?: ChartAction[];

  @Input()
  public set color(color: string) {
    this.backgroundColor = color.startsWith('--')
      ? getComputedStyle(document.documentElement)
          .getPropertyValue(color as string)
      : color;
  }

  @Input()
  public titleLabel?: string;

  @Input()
  public set summary(summary: Maybe<number>) {
    this.value = summary
      ? summary % 1 != 0 //only fixed if decimal
        ? summary.toFixed(2)
        : summary.toString()
      : '-';
  }

  @Input()
  public unit?: string;

  public backgroundColor?: string;

  public value?: string;

}