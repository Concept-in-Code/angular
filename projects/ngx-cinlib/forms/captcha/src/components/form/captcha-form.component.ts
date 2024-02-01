import { Component, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgHcaptchaComponent } from 'ng-hcaptcha';
import { Maybe } from 'ngx-cinlib/core';
import { filter, map } from 'rxjs';
import { CaptchaService } from '../../services/captcha.service';

@Component({
  selector: 'cin-captcha-form',
  templateUrl: './captcha-form.component.html',
  styleUrls: ['./captcha-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CaptchaFormComponent
    }
  ],
})
export class CaptchaFormComponent implements ControlValueAccessor {

  @ViewChildren(NgHcaptchaComponent)
  public captchaComponents?: QueryList<NgHcaptchaComponent>;

  private onChange?: (token: Maybe<string>) => void;

  private value?: Maybe<string>;

  public sitekey = this.captchaService.siteKey()
    .pipe(
      filter(siteKey => !!siteKey),
      map(sitKey => sitKey as string),
    );

  constructor(
    private captchaService: CaptchaService) { }

  public set token(token: Maybe<string> | undefined) {
    this.onChange?.(token);
    this.value = token

    !token && (this.captchaComponents?.forEach(component => component.reset()));
  }

  public get token(): Maybe<string> | undefined {
    return this.value;
  }

  writeValue(value: string): void {
    this.token = value;
  }

  registerOnChange(onChange: (token: Maybe<string> | undefined) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(): void {
    return;
  }

}
