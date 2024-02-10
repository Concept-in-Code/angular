import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Maybe, Media } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { MediaService } from 'ngx-cinlib/media/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'cin-media-form-upload',
  templateUrl: './media-form-upload.component.html',
  styleUrls: ['./media-form-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,
  ]
})
export class MediaFormUploadComponent {

  @Input()
  public disabled: Maybe<boolean> = false;

  @Output()
  public uploads = new EventEmitter<Media[]>();

  @Output()
  public back = new EventEmitter<void>();

  public isDraggedOver = false;

  constructor(
    private mediaService: MediaService
  ) {}

  @HostListener('dragover', ['$event'])
  public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggedOver = !this.disabled;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggedOver = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggedOver = false;

    if (!this.disabled
      && evt?.dataTransfer?.files?.length) {
        this.addFiles(evt.dataTransfer.files);
    }
  }

  public onFileBrowse(event: Event) {
    const files = (event?.target as HTMLInputElement)?.files;
    if (files?.length) {
      this.addFiles(files);
    }
  }

  public addFiles(fileList: FileList) {
    forkJoin(
      Array.from(fileList)
        .map(file => this.mediaService
        .fileToMedia(file))
    ).subscribe((media: Media[]) => this.uploads.emit(media));
      
  }

}