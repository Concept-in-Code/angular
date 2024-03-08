import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Media } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { MediaFormComponent } from '../form/media-form.component';

@Component({
  selector: 'cin-media-form-dialog',
  templateUrl: './media-form-dialog.component.html',
  styleUrls: ['./media-form-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    MatButtonModule,
    MatDialogModule,
    MediaFormComponent,
  ]
})
export class MediaFormDialogComponent {

  public media: Media[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public maxFiles: number) { }

}