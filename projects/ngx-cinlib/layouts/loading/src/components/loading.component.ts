import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'cin-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
  ]
})
export class LoadingComponent {

  public loading = this.loadingService.isLoading();

  constructor(
    private loadingService: LoadingService,
  ) { }

}