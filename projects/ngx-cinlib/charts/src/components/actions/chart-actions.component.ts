import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { TooltipDirective } from 'ngx-cinlib/tooltip';
import { ChartAction } from '../../typings/chart-actions';

@Component({
  selector: 'cin-chart-actions',
  templateUrl: './chart-actions.component.html',
  styleUrls: ['./chart-actions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,
    MatMenuModule,
    TooltipDirective,
  ]
})
export class ChartActionsComponent {

  @Input()
  public actions?: ChartAction[];

}
