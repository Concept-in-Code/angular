import { Injectable } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable()
export class FormStepperService {

  private currentStepIdx = new BehaviorSubject<Maybe<number>>(undefined);
  private steps = new BehaviorSubject<Maybe<Map<number, FormControlStatus>>>(undefined);
  
  private dirty = new BehaviorSubject<boolean>(false);
  private linear = new BehaviorSubject<boolean>(false);

  private getSteps(): Observable<Maybe<Map<Number, FormControlStatus>>> {
    return this.steps.asObservable();
  }

  public isDirty(): Observable<boolean> {
    return this.dirty.asObservable();
  }

  public currentIndex(): Observable<Maybe<number>> {
    return this.currentStepIdx.asObservable();
  }

  public isValid(): Observable<boolean> {
    return this.getSteps()
      .pipe(
        map(steps => steps
          ? !Array.from(steps?.values()).some(status => status === 'INVALID')
          : true
        )
      );
  }

  public lastStepIndex(): Observable<Maybe<number>> {
    return this.getSteps()
      .pipe(map(steps => steps?.size ? steps.size - 1 : undefined));
  }

  public setCurrentStepIdx(index: number): void {
    this.currentStepIdx.next(index);
  }

  public next(): void {
    if (this.currentStepIdx.value) {
      this.currentStepIdx.next(this.currentStepIdx.value + 1)
    }
  }

  public back(): void {
    if (this.currentStepIdx.value) {
      this.currentStepIdx.next(
        this.currentStepIdx.value < 1
           ? 0
           : this.currentStepIdx.value - 1
      );
    }
  }

  public setLinear(linear: boolean): void {
    this.linear.next(linear);
  }

  public registerStep(index: number, status: FormControlStatus): void {
    this.updateSteps(index, status);
  }

  public statusChanged(index: number, status: FormControlStatus) {
    this.dirty.next(true);
    this.updateSteps(index, status);
  }

  private updateSteps(index: number, status: FormControlStatus) {
    const steps = new Map(this.steps.value)

    steps.set(index, status);

    this.steps.next(steps);
  }

  public resetSteps(): void {
    this.dirty.next(false);
  }
}
