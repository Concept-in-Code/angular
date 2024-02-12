import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Maybe, Media } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { MediaEditDialogData, MediaEnhanced } from 'ngx-cinlib/media/common';
import { MediaActionCardComponent } from 'ngx-cinlib/media/elements';
import { ConfirmService, ConfirmType } from 'ngx-cinlib/modals/confirm';
import { FeedbackService, FeedbackType } from 'ngx-cinlib/modals/feedback';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { MediaFormEditComponent } from '../edit/media-form-edit.component';
import { MediaFormEntryComponent } from '../entry/media-form-entry.component';

@Component({
  selector: 'cin-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: MediaFormComponent
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MediaFormComponent,
    },
  ],
  imports: [
    CommonModule,
    I18nDirective,
    MatFormFieldModule,
    MediaActionCardComponent,
    MediaFormEntryComponent,
  ]
})
export class MediaFormComponent implements ControlValueAccessor, Validator, OnDestroy {

  @Input()
  public maxFiles?: number;

  @Input()
  public maxFileSize = 1024 * 1024 * 10 //10mb

  @Input()
  public media: (Media | MediaEnhanced)[] = [];

  @Input()
  public cardToggle = false;

  @Input()
  public titleToggle = false;

  @Output()
  public uploads: EventEmitter<(Media | MediaEnhanced)[]> = new EventEmitter();

  private onChange?: (value?: Maybe<(Media | MediaEnhanced)[]>) => void;
  private onTouched?: () => void;

  public validationErrors: string[] = [];

  private destroy = new Subject<void>();

  constructor(
    private feedbackService: FeedbackService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) { }

  public add(newMedia: Media[]) {
    this.onTouched?.();

    if (newMedia.some(element => (element.size || 0) > this.maxFileSize)) {
      this.feedbackService.open({
        type: FeedbackType.Error,
        labelMessage: 'filesCannotBeLargerThanX',
        labelAction: 'chooseOtherFile',
        labelVariables: new Map([
          ['maxFileSize', '10mb'],
        ]),
      })
    } else if (this.maxFiles && this.media?.length + newMedia.length > this.maxFiles) {
      this.feedbackService.open({
        type: FeedbackType.Error,
        labelMessage: 'notMoreThanXFiles',
        labelAction: 'chooseLessFiles',
        labelVariables: new Map([
          ['maxFiles', this.maxFiles?.toString()],
        ]),
      });
    } else {
      newMedia.length === 1
        ? this.openDetails(newMedia[0])
            .pipe(takeUntil(this.destroy))
            .subscribe(edited => {
              this.emit([...this.media, ...[edited]])
            })
        : this.emit([...this.media, ...newMedia]);
    }
  }

  public edit(index: number): void {
    this.openDetails(this.media[index])
      .pipe(takeUntil(this.destroy))
      .subscribe(edited => {
        const media = [...this.media];
        media[index] = edited;
        this.emit(media);
      })
  }

  public openDetails(media: Media | MediaEnhanced): Observable<Media | MediaEnhanced> {
    return this.dialog.open(MediaFormEditComponent, {
      panelClass: 'media-form-dialog',
      data: {   
        element: media,
        displayCardToggle: this.cardToggle,
        displayTitleToggle: this.titleToggle,
      } as MediaEditDialogData
    }).afterClosed()
      .pipe(filter(edited => !!edited));
  }

  public remove(index: number): void {
    this.confirmService
      .confirm({ type: ConfirmType.Delete })
      .subscribe(confirmed => {
        if (confirmed) {
          const media = [...this.media];
          media.splice(index, 1);
          this.emit(media);
        }
      })
  }

  private emit(newMedia: (Media | MediaEnhanced)[]): void {
    this.media = [...newMedia];
    this.uploads.emit(this.media);
    this.checkErrors();
    this.onChange?.(this.media);

    //TODO: This needs to be set because view is not updating. Needs debugging
    this.cdr.detectChanges();
  }

  private checkErrors(): void {
    this.validationErrors = [];

    if (this.cardToggle && !this.media.some(element => (element as MediaEnhanced).card)) {
      this.validationErrors.push('oneCardRequired');
    }

    if (this.titleToggle && !this.media.some(element => (element as MediaEnhanced).title)) {
      this.validationErrors.push('oneTitleRequired');
    }
  }

  public retrieveMedia(element: Media | MediaEnhanced): Maybe<Media> {
    return element && Object.hasOwn(element, 'media')
      ? (element as MediaEnhanced).media
      : element as Media;
  }

  public writeValue(media?: (Media | MediaEnhanced)[] | Media | MediaEnhanced): void {
    if (media) {
      this.media = Object.hasOwn(media, 'length')
        ? media as []
        : [media] as (Media | MediaEnhanced)[];
    }
  }

  public validate(): ValidationErrors | null {
    return this.validationErrors.length 
      ? this.validationErrors.reduce((acc, curr) => {
          acc[curr] = true;
          return acc;
        }, {} as ValidationErrors)
      : null;
  }

  public registerOnChange(onChange: (value?: Maybe<(Media | MediaEnhanced)[]>) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched?: () => void): void {
    this.onTouched = onTouched;
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}