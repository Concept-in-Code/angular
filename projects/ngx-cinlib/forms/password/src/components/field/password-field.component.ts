import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cin-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,  
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class PasswordFieldComponent implements ControlValueAccessor, OnInit, OnDestroy {
  
  public control = new FormControl('' as Maybe<string>);

  private onChange?: (value?: Maybe<string>) => void;
  private onTouched?: () => void;

  @Input()
  public label = 'password';

  public hide = true;
  public required = false;
  private destroy = new Subject<void>();

  constructor(
    @Optional() @Self()
    public ngControl: NgControl) {

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    } 

    this.control?.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(value => this.mark(value));
  }

  public ngOnInit(): void {
    if (this.ngControl) {
      this.required = this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
  }

  public writeValue(value: Maybe<string>): void {
    this.control.setValue(value);
    this.mark(value);
  }

  public mark(value: Maybe<string>) {
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
      ? this.control?.disable()
      : this.control?.enable();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
  
}