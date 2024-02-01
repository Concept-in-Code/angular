import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cin-captcha-dialog',
  templateUrl: 'captcha-dialog.component.html',
})
export class CaptchaDialogComponent implements OnDestroy {

  public control = new FormControl('', [Validators.required])

  private destroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<CaptchaDialogComponent>,
  ) {
    this.control?.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(token => token && this.dialogRef.close(token));
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}