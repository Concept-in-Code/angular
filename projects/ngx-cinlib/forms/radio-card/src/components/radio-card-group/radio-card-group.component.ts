import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, take } from 'rxjs';
import { RadioCardInput } from '../../typings/radio-card-input';
import { RadioCardComponent } from '../radio-card/radio-card.component';

@Component({
  selector: 'cin-radio-card-group',
  templateUrl: './radio-card-group.component.html',
  styleUrls: ['./radio-card-group.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RadioCardGroupComponent
    },
  ],
  imports: [
    CommonModule,
    RadioCardComponent,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class RadioCardGroupComponent<T> implements ControlValueAccessor, OnInit, OnDestroy {

  @Input()
  public value?: T;

  @Input()
  public inputs?: RadioCardInput[];

  @Input()
  public queryParamKey?: string;

  @Output()
  public valueChanged = new EventEmitter<T>();

  private onChange?: (value?: T) => void;

  private destroy = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    if (this.queryParamKey) {
      this.activatedRoute.queryParams
        .pipe(take(1))
        .subscribe(params => this.emit(params[this.queryParamKey || '']));
    }
  }

  public writeValue(value: T): void {
    this.next(value);
  }

  public next(value?: T) {
    if (this.queryParamKey) {
      this.router.navigate([], {

        queryParams: {
          [this.queryParamKey]: value
        },
        queryParamsHandling: 'merge',
      });
    }
    this.emit(value);
  }

  private emit(value?: T): void {
    this.value = value;
    this.valueChanged.emit(value);
    this.onChange?.(value);
  }

  public registerOnChange(onChange: (value?: T) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(): void {
    return;
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}