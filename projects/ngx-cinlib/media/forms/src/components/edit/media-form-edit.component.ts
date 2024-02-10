import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Maybe, Media } from 'ngx-cinlib/core';
import { AppValidators } from 'ngx-cinlib/forms/validators';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { MediaApiService, MediaEditDialogData, MediaEnhanced, MediaService } from 'ngx-cinlib/media/common';
import { take } from 'rxjs';

@Component({
  selector: 'cin-media-form-edit',
  templateUrl: './media-form-edit.component.html',
  styleUrls: ['./media-form-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    MatExpansionModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class MediaFormEditComponent {

  public form = this.fb.group({
    id: [''],
    card: [false],
    title: [false],
    media: this.fb.group({
      id: [''],
      name: [''],
      url: ['', [AppValidators.validUrl()]],
      attribution: this.fb.group({
        id: [''],
        title: [''],
        author: [''],
        source: [''],
        license: [''],
      })
    }),
  });

  private media?: Media;

  public isMediaMimeType = false;

  public displayUrl = false;
  public urlError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: MediaEditDialogData,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MediaFormEditComponent>,
    private mediaService: MediaService,
    private mediaApiService: MediaApiService,
  ) {
    this.media = this.extractMedia();
    this.isMediaMimeType = this.checkIsMediaMimeType(this.media);

    this.mediaApiService.getMediaBaseApi()
      .pipe(
        take(1)
      )
      .subscribe(mediaBaseApi => this.displayUrl = typeof this.media?.url === 'string'
        && (!mediaApiService || !this.media?.url.includes(mediaBaseApi as string))
      );

    this.form.patchValue({
      id: (this.data.element as MediaEnhanced).id,
      card: (this.data.element as MediaEnhanced)?.card,
      title: (this.data.element as MediaEnhanced)?.title,
      media: {
        id: this.media.id,
        name: this.media.name,
        url: this.media.url,
        attribution: {
          id: this.media.attribution?.id,
          title: this.media.attribution?.title,
          author: this.media.attribution?.author,
          source: this.media.attribution?.source,
          license: this.media.attribution?.license
        }
      }
    });
  }

  private extractMedia(): Media {
    return Object.hasOwn(this.data.element, 'media')
      ? (this.data.element as MediaEnhanced).media
      : this.data.element as Media;
  }

  private checkIsMediaMimeType(media: Maybe<Media>): boolean {
    const mimeType = this.mediaService.mimeTypeDefinition(media);
    return mimeType === 'IMAGE' || mimeType === 'VIDEO';
  }

  public onSubmit(): void {
    this.dialogRef.close(this.data.displayCardToggle || this.data.displayTitleToggle
      ? this.mapEnhancedMedia()
      : this.mapMedia());
  }
  
  // TODO: way to complex...
  // Alternative could be put every media field in forms without displaying, so that deep copying is not necessary
  private mapEnhancedMedia(): Partial<MediaEnhanced> {
    const result = Object.hasOwn(this.data.element, 'media')
      ? { ...{ ...this.data.element, ...this.form.value },
          media: { ...(this.data.element as MediaEnhanced).media, ...this.form.value.media }
        }
      : { ...this.form.value, media: {...this.data.element, ...this.form.value.media } };

    return this.hasAttributionValues()
      ? result
      : {
          ...result, media: {
            ...result.media, attribution: undefined
          } 
        };
  }

  private mapMedia(): Media {
    const result = { ...this.data.element, ...this.form.value.media };

    return this.hasAttributionValues()
      ? result
      : { ...result, attribution: undefined };
  }

  private hasAttributionValues(): boolean {
    let hasValues = false;
    const attributionForm = this.form.controls.media.controls.attribution;

    Object.keys(attributionForm.value).forEach(controlName => {
      const control = attributionForm.get(controlName);
      if (control?.value) {
        hasValues = true;
        return;
      }
    });

    return hasValues;
  }

}