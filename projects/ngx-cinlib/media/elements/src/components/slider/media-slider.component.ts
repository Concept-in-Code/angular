import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Maybe, Media } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { SliderComponent } from 'ngx-cinlib/layouts/slider';
import { DetailsTitleComponent, PageTitleComponent, SubTitleComponent, TitleType } from 'ngx-cinlib/layouts/title';
import { MediaCardType, MediaService, MediaViewerData, MimeTypeDefinition } from 'ngx-cinlib/media/common';
import { MediaActionCardComponent } from '../action-card/media-action-card.component';
import { MediaViewCardComponent } from '../view-card/media-view-card.component';
import { MediaViewerComponent } from '../viewer/media-viewer.component';

@Component({
  selector: 'cin-media-slider',
  templateUrl: './media-slider.component.html',
  styleUrls: ['./media-slider.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DetailsTitleComponent,
    I18nDirective,
    MediaActionCardComponent,
    MediaViewCardComponent,
    PageTitleComponent,
    RouterModule,
    SliderComponent,
    SubTitleComponent,
  ]
})
export class MediaSliderComponent {

  @Input()
  public actionLabel?: string;

  @Input()
  public media?: Maybe<Maybe<Media>[]>;

  @Input()
  public link?: string[];

  @Input()
  public linkLabel?: string = 'allMedia';
  
  @Input()
  public mediaCardType: MediaCardType = 'VIEW';
  
  @Input()
  public titleLabel?: string = 'media';

  @Input()
  public title?: Maybe<string>;

  @Input()
  public titleType: TitleType = 'DETAILS';

  @Output()
  public actionClicked = new EventEmitter<Maybe<Media>>();

  @Output()
  public deleted = new EventEmitter<Maybe<Media>>();

  constructor(
    public dialog: MatDialog,
    private mediaService: MediaService,) { }

  public mimeType(element?: Maybe<Media>): Maybe<MimeTypeDefinition> {
    return this.mediaService.mimeTypeDefinition(element);
  }

  public action(media?: Maybe<Media>) {
    this.actionClicked.emit(media);
  } 

  public delete(event: Maybe<Media>) {
    this.deleted.emit(event);
  }

  public open(media?: Maybe<Media>): void {
    if (media?.mimeType?.includes('image')) {
      this.openDialog('image', media);
    } else if (media?.mimeType?.includes('video')) {
      this.openDialog('video', media);
    }
  }

  public openDialog(mimeType: string, media?: Maybe<Media>): void {
    const filtered = this.media?.filter(element => element?.mimeType?.includes(mimeType));

    this.dialog.open(MediaViewerComponent, {
      data: {
        media: filtered,
        currentIndex: filtered?.findIndex(element => element?.id === media?.id)
      } as MediaViewerData,
      panelClass: 'media-dialog',
      autoFocus: false,
    });
  }
}
