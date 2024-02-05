import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cin-captcha-dialog',
  templateUrl: 'captcha-dialog.component.html',
})
export class CaptchaDialogComponent implements OnDestroy, OnInit {

  public control = new FormControl('', [Validators.required])

  private destroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<CaptchaDialogComponent>,
  ) {
  }

  public ngOnInit(): void {
    this.control?.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(token => token && this.dialogRef.close(token));
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}