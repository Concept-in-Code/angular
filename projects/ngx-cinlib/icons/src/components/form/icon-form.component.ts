import { CommonModule } from '@angular/common';
import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Maybe } from 'ngx-cinlib/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { SolidIcon, SolidIconsType, solidIcons } from '../../typings/solid-icons';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'cin-icon-form',
  templateUrl: './icon-form.component.html',
  styleUrls: ['./icon-form.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconFormComponent),
      multi: true
    }
  ],
  imports: [
    CommonModule,
    IconComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ]
})

export class IconFormComponent implements ControlValueAccessor, OnInit {

  public control = new FormControl<Maybe<SolidIconsType>>(undefined);

  public onChange?: (value: Maybe<SolidIconsType>) => void;
  public onTouched?: () => void;

  private destroy = new Subject<void>();
 
  constructor() {
    this.control.valueChanges
    .pipe(takeUntil(this.destroy))
    .subscribe(value => {
      this.onChange?.(value);
      this.onTouched?.();
    });
  }
  
  public icons: SolidIcon[] = solidIcons.map(icon => (['fas', icon]) as SolidIcon);  
  public filteredIcons = this.icons.slice(0, 15);

  public ngOnInit(): void {
    this.control.valueChanges.pipe(
      tap(value =>
        this.filteredIcons = this.icons
          ?.filter(icon => icon[1].includes(value ? value?.toString() : ''))
          ?.slice(0, 15)
          ?.sort((a, b) => {
            const aString = a[1] as string;
            const bString = b[1] as string;
            return aString.localeCompare(bString);
          })
      ),
      takeUntil(this.destroy),
    ).subscribe();    
  }

  public writeValue(value?: Maybe<SolidIconsType>): void {
    this.control.patchValue(value, { emitEvent: false });
  }

  public registerOnChange(onChange: (value: Maybe<SolidIconsType>) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
}