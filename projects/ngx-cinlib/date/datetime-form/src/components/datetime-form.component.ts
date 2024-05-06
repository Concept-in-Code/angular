import { NGX_MAT_DATE_FORMATS, NGX_MAT_NATIVE_DATE_FORMATS, NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatNativeDateAdapter, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
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
    },
    { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter },
    { provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS }
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
export class DatetimeFormComponent implements ControlValueAccessor, Validator, OnDestroy {

  @Input()
  public set minDate(date: Maybe<string | Date>) {
    if (date) {
      this._minDate = new Date(date);
    }
  }

  public get minDate(): Maybe<Date> {
    return this._minDate;
  }

  public _minDate?: Date;

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

  public writeValue(date: Date | string): void {
    date
      ? this.control.patchValue(new Date(date))
      : this.control.reset();
  }


  public validate(): ValidationErrors | null {
    if (!this.valid) {
      var errors = { ...this.control.errors };

      if ('matDatetimePickerMin' in errors) {
        errors = {...errors, invalidMinDate: true };
        delete errors['matDatetimePickerMin'];
      }

      return errors;
    } else {
      return null;
    }
  }

  get valid(): boolean {
    return this.control.valid;
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
