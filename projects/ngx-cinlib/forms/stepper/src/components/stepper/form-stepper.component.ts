import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnDestroy, Output, QueryList, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { Maybe } from 'ngx-cinlib/core';
import { CaptchaModule } from 'ngx-cinlib/forms/captcha';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { ConfirmService, ConfirmType } from 'ngx-cinlib/modals/confirm';
import { Subject, take, takeUntil } from 'rxjs';
import { FormStepperService } from '../../services/form-stepper.service';
import { FormStepComponent } from '../step/form-step.component';

@Component({
  selector: 'cin-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
  standalone: true,
  imports: [
    CaptchaModule,
    CommonModule,
    FormStepComponent,
    I18nDirective,
    MatButtonModule,
    MatExpansionModule,
  ],
  providers: [
    FormStepperService,
  ]
})
export class FormStepperComponent implements AfterViewInit, OnDestroy {

  //TODO: Implement linear mode
  @Input()
  public set linear(linear: boolean) {
    this.formStepperService.setLinear(linear);
  }

  @Input()
  public captchaRequired = false;

  @Output()
  public cancelled = new EventEmitter<void>();

  @Output()
  public saved = new EventEmitter<Maybe<string>>();

  @ContentChildren(FormStepComponent)
  private steps?: QueryList<FormStepComponent>;

  public dirty?: boolean;

  public valid = this.formStepperService.isValid();

  private destroy = new Subject<void>();

  constructor(
    private confirmService: ConfirmService,
    private formStepperService: FormStepperService,
  ) {
    this.formStepperService.isDirty()
      .pipe(takeUntil(this.destroy))
      .subscribe((dirty) => (this.dirty = dirty));
  }

  public ngAfterViewInit(): void {
    // Timeout fixes ERROR Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError
    // see: https://blog.angular-university.io/angular-debugging/
    setTimeout(() => this.steps?.forEach((step, index) => (step.index = index)));
  }

  public save(captchaToken?: string): void {
    this.saved.emit(captchaToken);
  }

  public cancel(): void {
    this.dirty
      ? this.confirmService
          .confirm({ type: ConfirmType.Cancel })
          .pipe(take(1))
          .subscribe((shouldCancel) =>
            shouldCancel && this.cancelled.emit())
      : this.cancelled.emit();
  }

  public reset(): void {
    this.confirmService
      .confirm({ type: ConfirmType.Reset })
      .pipe(take(1))
      .subscribe((shouldReset) =>
       shouldReset && this.resetSteps());
  }

  private resetSteps(): void {
    this.steps?.forEach((step) => step.reset());

    this.formStepperService.resetSteps();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
