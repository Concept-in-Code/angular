import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxChartsModule } from 'cinlib-charts';
import { TranslationService } from 'ngx-cinlib/i18n';
import { AxisChart } from '../../typings/chart-axis.base';
import { ChartContainerComponent } from '../container/chart-container.component';

@Component({
  selector: 'cin-chart-bar-vertical',
  templateUrl: './chart-bar-vertical.component.html',
  styleUrls: ['./chart-bar-vertical.component.scss'],
  standalone: true,
  imports: [
    ChartContainerComponent,
    CommonModule,
    NgxChartsModule,
  ]
})
export class ChartBarVerticalComponent extends AxisChart {

  @Input()
  public barPadding = 16;

  constructor(
    translationService: TranslationService) {
      super(translationService);
  }

}