import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Maybe, Media } from 'ngx-cinlib/core';
import { MediaFormMode } from 'ngx-cinlib/media/common';
import { MediaFormUploadComponent } from '../upload/media-form-upload.component';
import { MediaFormUrlComponent } from '../url/media-form-url.component';

@Component({
  selector: 'cin-media-form-entry',
  templateUrl: './media-form-entry.component.html',
  styleUrls: ['./media-form-entry.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MediaFormEntryComponent,
    }
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MediaFormUploadComponent,
    MediaFormUrlComponent,
  ]
})
export class MediaFormEntryComponent implements ControlValueAccessor {

  @Output()
  public uploads: EventEmitter<Media[]> = new EventEmitter();

  public isDisabled = false;

  public media: Media[] = [];

  public mode?: MediaFormMode;

  private onChange?: (value?: Maybe<Media[]>) => void;
  private onTouched?: () => void;

  public emit($event: Media[]) {
    this.onTouched?.();
    this.uploads.emit($event);
    this.mode = undefined;
  }

  public removeFile(fileIndex: number) {
    this.onTouched?.();
    this.media.splice(fileIndex, 1);
    this.onChange?.(this.media);
    this.uploads.emit(this.media);
  }

  public writeValue(media: Media[]): void {
    this.media = media;
  }

  public registerOnChange(onChange: (value?: Maybe<Media[]>) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched?: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.mode = undefined;
    }
  }
}