/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidUrl } from 'ngx-cinlib/utils';

@Injectable({
  providedIn: 'root',
})
export class AppValidators {
  /**
   *
   * CONTROL VALIDATIONS
   *
   */

  public static decimal(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^-?[0-9]\d*([.,]\d+)?$/;

      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { numbersOnly: true };
      }

      return null;
    };
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

  public static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { invalidEmail: true };
      }

      return null;
    };
  }

  public static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^[+]*[0-9]+$/;
      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { numbersOnly: true };
      }

      return null;
    };
  }

  public static number(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^[0-9]+$/;
      if (!control.value) {
        return null;
      }

      if (!pattern.test(control.value)) {
        return { numbersOnly: true };
      }

      return null;
    };
  }

  public static validUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!isValidUrl(control.value)) {
        return { invalidUrl: true };
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
