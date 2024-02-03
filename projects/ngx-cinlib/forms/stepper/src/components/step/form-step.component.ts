import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent, SolidIconsType } from 'ngx-cinlib/icons';
import { Subject, takeUntil } from 'rxjs';
import { FormStepperService } from '../../services/form-stepper.service';

@Component({
  selector: 'cin-form-step',
  templateUrl: './form-step.component.html',
  styleUrls: ['./form-step.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    ReactiveFormsModule
  ],
})
export class FormStepComponent implements OnDestroy {

  @Input()
  public descriptionLabel?: string;

  @Input()
  public icon?: SolidIconsType;

  @Input({ required: true })
  public set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup;
    this.initFormGroup();

    this.hasRequiredValidator = Object.keys(this._formGroup.controls)
      ?.some(key => this._formGroup.controls[key].hasValidator(Validators.required));
  }


  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  private _formGroup!: FormGroup;

  @Input()
  public hideToggle = false;

  @Input({ required: true })
  public titleLabel?: string;

  @Input()
  public required = false;

  @Output()
  public stepEntered = new EventEmitter<void>();

  @Output()
  public stepLeft = new EventEmitter<void>();

  public currentStepIdx?: Maybe<number>;
  public lastStepIdx?: Maybe<number>;

  public set index(index: Maybe<number>) {
    this._index = index;
    this.initFormGroup();

    this.initLastStep();
    this.initCurrentStep();
  }

  public get index(): Maybe<number> {
    return this._index;
  }

  private _index?: Maybe<number>;

  public entered = false;
  public left = false;

  public resetValue?: unknown;

  public hasRequiredValidator = false;

  private destroy = new Subject<void>();

  constructor(
    private formStepperService: FormStepperService,
  ) { }

  private initFormGroup() {
    if (this.index !== undefined && this.index !== null && this.formGroup) {
      this.resetValue = this.formGroup.value;
      this.formStepperService.registerStep(this.index, this.formGroup.status);
      this.formGroup.statusChanges
        .pipe(takeUntil(this.destroy))
        .subscribe(() => this.formStepperService
          .statusChanged(this.index as number, this.formGroup.status)
        );
    }
  }
  
  private initLastStep(): void {
    this.formStepperService.lastStepIndex()
      .pipe(takeUntil(this.destroy))
      .subscribe(lastStep => this.lastStepIdx = lastStep);
  }

  private initCurrentStep(): void {
    this.formStepperService.currentIndex()
      .pipe(takeUntil(this.destroy))
      .subscribe(currentStepIdx => {
        this.currentStepIdx = currentStepIdx

        if (this.currentStepIdx === this.index) {
          this.entered = true;
          this.stepEntered.emit();
        }

        if (this.entered && this.currentStepIdx !== this.index) {
          this.left = true;
          this.stepLeft.emit();
        }
      });
  }

  public isInvalid(): boolean {
    return this.left && this.formGroup.invalid;
  }

  public setCurrentStep(): void {
    this.formStepperService.setCurrentStepIdx((this.index || 0));
  }

  public back(): void {
    this.formStepperService.back();
  }
  
  public next(): void {
    this.formStepperService.next();
  }

  public showBackButton(): boolean {
    return this.index !== 0;
  }

  public showNextButton(): boolean {
    return this.index !== this.lastStepIdx;
  }

  public reset(): void {
    if (this.resetValue) {
      this.formGroup.reset(this.resetValue);
    }
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}