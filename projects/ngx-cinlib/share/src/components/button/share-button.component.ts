import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Maybe } from 'ngx-cinlib/core';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { TooltipDirective } from 'ngx-cinlib/tooltip';
import { ShareDialogComponent } from '../dialog/share-dialog.component';

@Component({
  selector: 'cin-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatButtonModule,
    ShareDialogComponent,
    TooltipDirective,
  ]
})
export class ShareButtonComponent {

  @Input()
  public url?: string;

  @Input()
  public withLabel = false;

  public shareWithOthersLabel = 'shareWithOthers';

  constructor(
    public dialog: MatDialog) {}

  public openDialog(): void {
    this.dialog.open(ShareDialogComponent, {
      data: this.url
    });
  }

  public createTooltip(): Maybe<string> {
    return this.withLabel
      ? null
      : this.shareWithOthersLabel;
  }

}
