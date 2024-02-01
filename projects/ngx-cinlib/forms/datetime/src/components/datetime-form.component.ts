import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cin-datetime-form',
  templateUrl: './datetime-form.component.html',
  styleUrls: ['./datetime-form.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeFormComponent),
      multi: true
    }
  ],
  imports: [
    CommonModule,

    I18nDirective,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,

    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,

    ReactiveFormsModule,
  ]
})
export class DatetimeFormComponent implements ControlValueAccessor, OnDestroy {

  @Input()
  public minDate?: Date;

  @Input()
  public stepMinute = 15;

  @Input()
  public label = 'begin'; 

  public control = new FormControl(new Date());

  public onChange?: (value: Maybe<Date>) => void;
  public onTouched?: () => void;

  private destroy = new Subject<void>();

  constructor() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(result => {
        this.onTouched?.();
        this.onChange?.(result);
      });
  }

  public writeValue(date: Date): void {
    this.control.patchValue(date);
  }

  public registerOnChange(onChange: (value: Maybe<Date>) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable()
      : this.control.enable();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
