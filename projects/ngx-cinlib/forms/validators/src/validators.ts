/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidUrl } from 'ngx-cinlib/utils';

export class CinValidators {
  /**
   *
   * CONTROL VALIDATIONS
   *
   */

  public static decimal(control: AbstractControl): ValidationErrors | null {
    const pattern = /^-?[0-9]\d*([.,]\d+)?$/;

    if (!control.value) {
      return null;
    }

    if (!pattern.test(control.value)) {
      return { numbersOnly: true };
    }

    return null;
  }

  public static digits(digits: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = new RegExp(`^[0-9]{${digits}}$`);

      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { digitsNotMatching: true };
      }

      return null;
    };
  }

  public static email(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!control.value) {
      return null;
    }

    if (!pattern.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }

  public static phone(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[+]*[0-9]+$/;
      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { numbersOnly: true };
      }

      return null;
  }

  public static number(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[0-9]+$/;
      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { numbersOnly: true };
      }

      return null;
  }

  public static validUrl(control: AbstractControl): ValidationErrors | null {
    if (!isValidUrl(control.value)) {
      return { invalidUrl: true };
    }

    return null;
  }


  public static minValue(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as number;
      if (value === null || value === undefined || (typeof value === 'string' && value === '')) {
        return null;
      }

      if (isNaN(value) || value < minValue) {
        return { minValue: { requiredValue: minValue, actualValue: value } };
      }
      return null;
    };
  }

  /**
   *
   * GROUP VALIDATIONS
   *
   */
  public static allOrNone(...controls: string[]): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const values = controls.map((fieldName) => group?.get(fieldName)?.value);

      const allUnset = values.every((value) => value == null || value === '');
      const allSet = values.every((value) => value != null && value !== '');

      return allUnset || allSet ? null : { allOrNoneFieldsRequired: true };
    };
  }

  static dateBefore(startControl: string, endControl: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const startDateControl = group?.get(startControl);
      const endDateControl = group?.get(endControl);

      const startDate = startDateControl?.value;
      const endDate = endDateControl?.value;

      return !startDate || !endDate
        ? null
        : startDate > endDate
        ? { startNotBeforeEnd: true }
        : null;
    };
  }

  static either(...controls: string[]): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      return controls.some((i) => !!group?.get(i)?.value)
        ? null
        : { noneSet: true };
    };
  }

  static ifMatchValueOtherFilled(
    control: string,
    value: any,
    otherControl: string
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      return group?.get(control)?.value === value &&
        !group?.get(otherControl)?.value
        ? { otherNotFilled: true }
        : null;
    };
  }

  public static same(...controls: string[]): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const values = controls.map((i) => group?.get(i)?.value);

      return values.every((i) => i === values[0]) ? null : { notSame: true };
    };
  }
}
