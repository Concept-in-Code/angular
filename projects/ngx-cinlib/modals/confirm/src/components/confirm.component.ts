import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { ConfirmInput } from '../typings/confirm';

@Component({
  selector: 'cin-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  standalone: true,
  imports: [
    CommonModule,

    I18nDirective,

    MatButtonModule,
    MatDialogModule,
  ],
})
export class ConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Maybe<ConfirmInput>
  ) {}

}
