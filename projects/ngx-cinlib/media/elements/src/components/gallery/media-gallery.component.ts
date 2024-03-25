import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Maybe, Media } from 'ngx-cinlib/core';
import { RadioButtonGroupComponent, RadioButtonInput } from 'ngx-cinlib/forms/radio-button';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { PageTitleComponent } from 'ngx-cinlib/layouts/title';
import { MediaDisplayType, MediaViewerData } from 'ngx-cinlib/media/common';
import { MediaViewCardComponent } from '../view-card/media-view-card.component';
import { MediaViewerComponent } from '../viewer/media-viewer.component';

@Component({
  selector: 'cin-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,
    MediaViewCardComponent,
    PageTitleComponent,
    RadioButtonGroupComponent,
    RouterModule,
  ]
})
export class MediaGalleryComponent implements OnInit, OnChanges {

  @Input()
  public backLabel?: string = 'back';

  @Input()
  public backRoute?: string[];
  
  @Input()
  public media?: Maybe<Media[]>;

  @Input()
  public showTitle = true;

  @Input()
  public showBack = true;

  public files?: Media[];
  public images?: Media[];
  public videos?: Media[];

  public fileType = MediaDisplayType.Image;

  public inputs?: RadioButtonInput[];

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  public ngOnInit(): void {
    this.init();
  }

  public ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.inputs = [];
    this.files = [];
    this.images = [];
    this.videos = [];

    if (this.media?.length) {
      this.media?.forEach(element => {
        if (element) {
          if (element?.mimeType?.includes('image')) {
            this.images?.push(element);
          } else if (element?.mimeType?.includes('video')) {
            this.videos?.push(element);
          } else {
            this.files?.push(element);
          }
        }
      });
    }

    if (this.files?.length) {
      this.fileType = MediaDisplayType.File;
      this.inputs?.push({
        icon: ['fas', 'file'],
        label: 'files',
        value: MediaDisplayType.File
      });

    if (this.videos?.length) {
      this.fileType = MediaDisplayType.Video;
      this.inputs?.push({
        icon: ['fas', 'video'],
        label: 'videos',
        value: MediaDisplayType.Video
      })
    }

    if (this.images?.length) {
      this.fileType = MediaDisplayType.Image;
      this.inputs.push({
        icon: ['fas', 'image'],
        label: 'images',
        value: MediaDisplayType.Image
      });
    }
    }
  }

  public routeBack(): void {
    this.backRoute
      ? this.router.navigate(this.backRoute)
      : this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  public openViewer(index: number, media?: Maybe<Maybe<Media>[]>): void {
    this.dialog.open(MediaViewerComponent, {
      data: {
        media: media,
        currentIndex: index
      } as MediaViewerData,
      panelClass: 'media-dialog',
      autoFocus: false,
    });
  }

}
