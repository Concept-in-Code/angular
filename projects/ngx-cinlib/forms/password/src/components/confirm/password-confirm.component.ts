import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Maybe } from 'ngx-cinlib/core';
import { CinValidators } from 'ngx-cinlib/forms/validators';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { Subject, takeUntil } from 'rxjs';
import { PasswordService } from '../../services/password.service';
import { PasswordFieldComponent } from '../field/password-field.component';
import { PasswordStrengthComponent } from '../strength/password-strength.component';

@Component({
  selector: 'cin-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: PasswordConfirmComponent
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: PasswordConfirmComponent
    },
  ],
  imports: [
    CommonModule,
    FormsModule,
    I18nDirective,
    PasswordFieldComponent,
    PasswordStrengthComponent,
    ReactiveFormsModule,
  ]
})
export class PasswordConfirmComponent implements ControlValueAccessor, OnDestroy, Validator {

  private onChange?: (value?: Maybe<string>) => void;
  private onTouched?: () => void;

  public form = this.fb.group({
    password: ['',
      [Validators.required],
      [this.passwordService.validate.bind(this.passwordService)]
    ],
    confirm: ['',
      [Validators.required]
    ]
  }, {validators: CinValidators.same('password', 'confirm')});

  get valid(): boolean {
    return this.form.valid;
  }

  private destroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService) {
      this.form.valueChanges
        .pipe(takeUntil(this.destroy))
        .subscribe(value => this.mark(value?.password));
  }  

  public writeValue(value: Maybe<string>): void {
    this.form.patchValue({
      password: value
    });
  }

  public mark(value: Maybe<string>) {
    !value && this.passwordService.resetPasswordStrength();
    this.onChange?.(value);
    this.onTouched?.();
  }

  public registerOnChange(onChange: (value?: Maybe<string>) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched?: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.form.disable()
      : this.form.enable();
  }

  public validate(): ValidationErrors | null {
    return !this.valid
      ? {
          ...this.form.errors,
          ...this.form.controls.confirm.errors,
          ...this.form.controls.password.errors
        }
      : null;
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}