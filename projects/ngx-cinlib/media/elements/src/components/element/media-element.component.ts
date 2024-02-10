import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Maybe, Media } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';
import { AttributionDirection, MediaAttributionDirective, MediaService, MediaViewerData, MimeTypeDefinition } from 'ngx-cinlib/media/common';
import { MediaVideoComponent } from '../video/media-video.component';
import { MediaViewerComponent } from '../viewer/media-viewer.component';

@Component({
  selector: 'cin-media-element',
  templateUrl: './media-element.component.html',
  styleUrls: ['./media-element.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    MediaAttributionDirective,
    MediaVideoComponent,
  ]
})
export class MediaElementComponent implements OnInit, OnChanges {

  @Input()
  public media?: Maybe<Media>;

  @Input()
  public attributionDirection: AttributionDirection = 'BOTTOM-RIGHT';

  @Input()
  public clickable = true;

  @Output()
  public clicked = new EventEmitter<Media>();

  public mimeType?: Maybe<MimeTypeDefinition>;

  constructor(
    public dialog: MatDialog,
    private mediaService: MediaService,
  ) { }

  public ngOnInit(): void {
    this.mimeType = this.mediaService.mimeTypeDefinition(this.media);
  }

  public ngOnChanges(): void {
    this.mimeType = this.mediaService.mimeTypeDefinition(this.media);
  }

  public click(): void {
    this.clicked.observed
      ? this.clicked.emit()
      : this.clickable
        ? this.dialog.open(MediaViewerComponent, {
            data: {
              media: [this.media],
            } as MediaViewerData,
            panelClass: 'media-dialog',
            autoFocus: false,
          })
        : null;
  }

}
