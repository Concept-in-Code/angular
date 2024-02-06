import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { SchedulerService } from '../../services/scheduler.service';

@Component({
  selector: 'cin-scheduler-overview',
  templateUrl: './scheduler-overview.component.html',
  styleUrls: ['./scheduler-overview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatDialogModule,
    MatDividerModule,
  ]
})

export class SchedulerOverviewComponent {

  public results = this.schedulerService.getResult();

  constructor(
    private schedulerService: SchedulerService,
  ) {}

  public deleteAll(): void {
    this.schedulerService.reset();
  }

  public remove(index: number): void {
    this.schedulerService.delete(index);
  }

}
