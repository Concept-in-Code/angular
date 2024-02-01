import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { CaptchaDialogComponent } from './components/dialog/captcha-dialog.component';
import { CaptchaFormComponent } from './components/form/captcha-form.component';
import { CaptchaSubmitComponent } from './components/submit/captcha-submit.component';

const components = [
  CaptchaDialogComponent,
  CaptchaFormComponent,
  CaptchaSubmitComponent,
];

const framework = [
  CommonModule,
  ReactiveFormsModule
];

const materials = [
  MatButtonModule,
  MatDialogModule,
];

const modules = [
  I18nDirective
];

const libs = [
  NgHcaptchaModule.forRoot({
    languageCode: 'de' //TODO
  }),
];

@NgModule({
  declarations: [...components],
  imports: [
    ...framework,
    ...materials,
    ...modules,
    ...libs,
  ],
  exports: [...components],
})
export class CaptchaModule { }