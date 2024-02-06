import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { SchedulerService } from '../../services/scheduler.service';

@Component({
  selector: 'cin-scheduler-errors',
  templateUrl: './scheduler-errors.component.html',
  styleUrls: ['./scheduler-errors.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    I18nDirective
  ]
})
export class SchedulerErrorsComponent {

  public errors = this.schedulerService.getErrors();

  constructor(
    private schedulerService: SchedulerService,
  ) {}
  

}
