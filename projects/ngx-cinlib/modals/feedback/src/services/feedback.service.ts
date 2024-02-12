import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackComponent } from '../components/feedback.component';
import { Feedback, FeedbackType } from '../typings/feedback';

@Injectable({ providedIn: 'root' })
export class FeedbackService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  public open(feedback: Feedback): void {
    this.snackBar.dismiss();
    this.snackBar.openFromComponent(FeedbackComponent, {
      duration: this.duration(feedback.type),
      data: feedback,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  private duration(type: FeedbackType): number {
    switch (type) {
      case FeedbackType.Critical:
        return 999999;
      case FeedbackType.Error:
      case FeedbackType.Info:
        return 15000;
      default:
        return 3000;
    }
  }
}
