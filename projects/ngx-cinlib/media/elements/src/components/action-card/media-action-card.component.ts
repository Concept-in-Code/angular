import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Maybe, Media } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { MediaService, MimeTypeDefinition } from 'ngx-cinlib/media/common';
import { MediaElementComponent } from '../element/media-element.component';

@Component({
  selector: 'cin-media-action-card',
  templateUrl: './media-action-card.component.html',
  styleUrls: ['./media-action-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,
    MatCardModule,
    MediaElementComponent,
  ]
})
export class MediaActionCardComponent implements OnInit, OnChanges {

  @Input()
  public actionLabel?: Maybe<string>;

  @Input()
  public media?: Maybe<Media>;

  @Input()
  public showDelete = false;

  @Output()
  public action = new EventEmitter<Maybe<Media>>();

  @Output()
  public deleted = new EventEmitter<Maybe<Media>>();

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

  public delete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit(this.media);
  }

}
