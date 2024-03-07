import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { MediaService } from 'ngx-cinlib/media/common';

@Component({
  selector: 'cin-media-external-consent',
  styleUrls: ['media-external-consent.component.scss'],
  templateUrl: 'media-external-consent.component.html',
  standalone: true,
  imports: [
    CommonModule,
    I18nDirective,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class MediaExternalConsentComponent {

  @Input()
  public externalUrl?: Maybe<string>;

  @Output()
  public allowed = new EventEmitter<void>();

  public rememberConsent = false;

  constructor(
    private mediaService: MediaService) { }

  public loadExternalContent(event: UIEvent): void {
    event.stopPropagation();
    this.allowed.emit();
    if (this.rememberConsent) {
      this.mediaService.setAllowExternalContent(true);
    }
  }
}
