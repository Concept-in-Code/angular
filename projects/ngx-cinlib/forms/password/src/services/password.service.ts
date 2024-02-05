import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasswordService {

  private strengthRate = new BehaviorSubject<Maybe<number>>(undefined);

  private minEntropy = new BehaviorSubject<number>(40);

  public passwordStrength(): Observable<Maybe<number>> {
    return this.strengthRate.asObservable();
  }

  public resetPasswordStrength(): void {
    this.strengthRate.next(undefined);
  }

  public setMinStrengthEntropy(minEntropy: number) {
    this.minEntropy.next(minEntropy);
  }

  public validate(
    control: AbstractControl,
  ): Observable<Maybe<{passwordWeak: boolean }>> {
    if (!control.value) {
      return of(null);
    }

    return this.minEntropy.asObservable()
      .pipe(
        map(minEntropy => this.calculatePasswordEntropy(control.value) / minEntropy),
        tap(strengthRate => this.strengthRate.next(strengthRate)),
        map(strengthRate => strengthRate < 1 ? { passwordWeak : true } : null)
      )
  }

  //TODO: Use zxcvbn
  private calculatePasswordEntropy(password: string): number {
    const possibleCombinations = Math.pow(this.getCharacterSpaceSize(password), password.length);
    return Math.log(possibleCombinations) / Math.log(2) + 1e-10;
  }
  
  private getCharacterSpaceSize(password: string): number {
    let characterSpaceSize = 0;
  
    if (/[a-z]/.test(password)) {
      characterSpaceSize += 26;
    }
    if (/[A-Z]/.test(password)) {
      characterSpaceSize += 26;
    }
    if (/\d/.test(password)) {
      characterSpaceSize += 10;
    }
    if (/\W/.test(password)) {
      characterSpaceSize += 40;
    }
  
    return characterSpaceSize;
  }
}