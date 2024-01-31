import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { Feedback, FeedbackType } from '../typings/feedback';

@Component({
  selector: 'cin-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [
    CommonModule,

    IconComponent,
    I18nDirective,

    MatButtonModule,
  ],
})
export class FeedbackComponent {

  public critical = FeedbackType.Critical;
  public error = FeedbackType.Error;
  public info = FeedbackType.Info;
  public success = FeedbackType.Success;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public feedback: Feedback,
    public ref: MatSnackBarRef<FeedbackComponent>,
  ) { }
}
