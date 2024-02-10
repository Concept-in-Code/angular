import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Maybe, Media } from 'ngx-cinlib/core';
import { MediaService } from 'ngx-cinlib/media/common';
import { Subject, takeUntil } from 'rxjs';
import { MediaExternalConsentComponent } from '../consent/media-external-consent.component';

@Component({
  selector: 'cin-media-video',
  templateUrl: './media-video.component.html',
  styleUrls: ['./media-video.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MediaExternalConsentComponent,
  ],
})
export class MediaVideoComponent implements OnChanges, OnDestroy {

  @Input()
  public media?: Maybe<Media>;

  public allowExternalContent?: Maybe<boolean>;

  public videoElement?: HTMLVideoElement;

  @ViewChild('video') set elementRef(content: ElementRef) {
    if (content) {
      this.videoElement = content.nativeElement;
    }
  }

  public youtubeUrl?: Maybe<string>;

  public url?: SafeResourceUrl;

  private destroy = new Subject<void>();

  constructor(
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,) {
      this.mediaService.getAllowExternalContent()
        .pipe(takeUntil(this.destroy))
        .subscribe(allowExternalContent => this.allowExternalContent = allowExternalContent);
    }

  public ngOnChanges(): void {
    this.youtubeUrl = this.mediaService.parseYoutubeUrl(this.media?.url);

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeUrl ?? this.media?.url as string);
    if (this.videoElement) {
      this.videoElement.load();
    }
  }

  public getHostname(): string {
    return this.mediaService.getUrlHost(this.media?.url as string);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
