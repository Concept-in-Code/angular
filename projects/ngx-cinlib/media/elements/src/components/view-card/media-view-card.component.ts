import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Maybe, Media } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';
import { FileSizePipe, MediaApiService, MediaService, MimeTypeDefinition } from 'ngx-cinlib/media/common';
import { take } from 'rxjs';
import { MediaElementComponent } from '../element/media-element.component';

@Component({
  selector: 'cin-media-view-card',
  templateUrl: './media-view-card.component.html',
  styleUrls: ['./media-view-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FileSizePipe,
    IconComponent,
    MatCardModule,
    MediaElementComponent,
  ]
})
export class MediaViewCardComponent implements OnInit {

  @Input()
  public media?: Maybe<Media>;

  @Output()
  public clicked = new EventEmitter<Maybe<Media>>();

  @Output()
  public deleted = new EventEmitter<Maybe<Media>>();

  public mimeType?: Maybe<MimeTypeDefinition>;

  constructor(
    public dialog: MatDialog,
    private mediaService: MediaService,
    private mediaApiService: MediaApiService,
  ) { }

  public ngOnInit(): void {
    this.mimeType = this.mediaService.mimeTypeDefinition(this.media);
  }

  public click(): void {
    this.clicked.emit(this.media);
  }

  public download(event: MouseEvent): void {
    event.stopPropagation();
    this.mediaApiService.createDownloadApi(this.media)
      .pipe(take(1))
      .subscribe(url => window.location.href = url);
  }

}
