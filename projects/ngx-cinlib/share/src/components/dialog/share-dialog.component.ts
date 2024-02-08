import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IconComponent } from 'ngx-cinlib/icons';
import { ShareModule } from 'ngx-sharebuttons';

@Component({
  selector: 'cin-share-dialog',
  templateUrl: 'share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    MatDialogModule,
    MatButtonModule,
    ShareModule,
  ]
})
export class ShareDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public url: string
  ) {}
}

