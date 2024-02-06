import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { SchedulerService } from '../../services/scheduler.service';

@Component({
  selector: 'cin-scheduler-execute',
  templateUrl: './scheduler-execute.component.html',
  styleUrls: ['./scheduler-execute.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    MatButtonModule,
  ]
})
export class SchedulerExecuteComponent {

  public errors = this.schedulerService.getErrors();

  constructor(
    private schedulerService: SchedulerService,
  ) { }

  public generate(): void {    
    this.schedulerService.generateResult();
  }

}
