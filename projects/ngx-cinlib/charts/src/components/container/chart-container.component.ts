import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { ChartAction } from '../../typings/chart-actions';
import { ChartActionsComponent } from '../actions/chart-actions.component';

@Component({
  selector: 'cin-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
  standalone: true,
  imports: [
    ChartActionsComponent,
    CommonModule,
    I18nDirective,
    MatCardModule,
  ]
})
export class ChartContainerComponent {

  @Input()
  public titleLabel?: string;

  @Input()
  public title?: string;

  @Input()
  public actions?: ChartAction[];

}