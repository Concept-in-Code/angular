import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { RadioButtonInput } from '../../typings/radio-button-input';

@Component({
  selector: 'cin-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RadioButtonComponent
    },
  ],
  imports: [
    CommonModule,
    I18nDirective,
    IconComponent,
    MatButtonModule,
    ReactiveFormsModule,
  ]
})
export class RadioButtonComponent<T> implements ControlValueAccessor, OnChanges {

  @Input()
  public input?: RadioButtonInput;

  @Input()
  public value?: T;

  @Output()
  public valueChanged = new EventEmitter<T>();

  public checked = false;

  public disabled = false;

  private onChange?: (value?: T) => void;
  private onTouched?: () => void;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['value']) {
      this.checked = this.input?.value === this.value
    }
  }

  public changeSelect(event: MouseEvent): void {
    event.stopPropagation();
    this.valueChanged.emit(this.input?.value as T);
    this.onChange?.(this.input?.value as T);
    this.onTouched?.();
  }

  public writeValue(value: T): void {
    this.value = value;
  }

  public registerOnChange(onChange: (value?: T) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
}