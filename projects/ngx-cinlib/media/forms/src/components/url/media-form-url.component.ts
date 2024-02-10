import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Media } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { MediaApiService, MediaService } from 'ngx-cinlib/media/common';
import { MediaElementComponent } from 'ngx-cinlib/media/elements';
import { EMPTY, Subject, filter, map, of, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'cin-media-form-url',
  templateUrl: './media-form-url.component.html',
  styleUrls: ['./media-form-url.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    IconComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MediaElementComponent,
    ReactiveFormsModule,
  ]
})
export class MediaFormUrlComponent implements OnDestroy {

  @Output()
  public back = new EventEmitter<void>();

  @Output()
  public upload = new EventEmitter<Media>();

  public control = new FormControl<string>('');

  public isYoutube = false;

  public media?: Media;

  private destroy = new Subject<void>();

  constructor(
    private mediaService: MediaService,
    private mediaApiService: MediaApiService,
    private httpClient: HttpClient
  ) {
    this.control.valueChanges
      .pipe(
        filter(value => MediaService.isValidUrl(value)),
        switchMap(url => this.mediaApiService.getMediaMimeTypeApi()
          .pipe(map(api => [url, api]))
        ),
        switchMap(([url, mimeTypeApi]) => {
          const youtubeUrl = this.mediaService.parseYoutubeUrl(url);
          return youtubeUrl
            ? of({
                url: youtubeUrl ?? url,
                mimeType: 'video/mp4'
              })
            : mimeTypeApi
              ? this.httpClient.post(mimeTypeApi, url, { responseType: 'text' })
                  .pipe(
                    switchMap(mimeType => mimeType 
                      ? of ({
                          url,
                          mimeType
                        })
                      : EMPTY
                    )
                  )
              : of({
                url,
                mimeType: 'application/text'
              })

        }),
        takeUntil(this.destroy)
      ).subscribe(media => {
        this.media = media;
        this.upload.emit(this.media);
      })
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}