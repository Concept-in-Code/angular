import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
  ]
})

export class SchedulerOverviewComponent {

  public results = this.schedulerService.getResult();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public schedulerService: SchedulerService,
  ) { }

  public deleteAll(): void {
    this.schedulerService.reset();
  }

  public remove(index: number): void {
    this.schedulerService.delete(index);
  }

}
