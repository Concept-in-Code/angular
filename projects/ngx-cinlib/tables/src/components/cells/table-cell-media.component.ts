import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Media } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';
import { MediaViewerData } from 'ngx-cinlib/media/common';
import { MediaViewerComponent } from 'ngx-cinlib/media/elements';
import { MediaFormDialogComponent } from 'ngx-cinlib/media/forms';
import { take } from 'rxjs';
import { TableService } from '../../services/table.service';
import { TableCellComponent } from './table-cell';

@Component({
  selector: 'cin-table-cell-media',
  template: `
    @if (editMode) {
      <!-- EDIT AREA -->
      <button mat-button (click)="openForm()">
        <cin-icon [icon]="['fas', 'upload']"></cin-icon>
      </button>
    } @else {
      <!-- DISPLAY AREA -->
      @if (input) {
        <button mat-button (click)="openViewer()">
          <cin-icon [icon]="['fas', 'image']"></cin-icon>
        </button>
      } @else {
        <span>{{ ' - ' }}</span>
      }
    }
  `,
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    MatButtonModule,
    MediaViewerComponent
  ]
})
export class TableCellMediaComponent extends TableCellComponent<Media> {

  constructor(
    tableService: TableService,
    private dialog: MatDialog,
  ) {
    super(tableService);
  }

  public openForm(): void {
    this.dialog.open(MediaFormDialogComponent, {
      data: 1,
      autoFocus: false,
    }).afterClosed()
    .pipe(take(1))
    .subscribe((value: Media[]) => {
      if (this.column && this.row && value?.length) {
        this.tableService.editRow(
          this.column?.field,
          value[0]
        )
      }
    });
  }

  public openViewer(): void {
    this.dialog.open(MediaViewerComponent, {
      data: {
        media: [this.input],
        currentIndex: 0
      } as MediaViewerData,
      panelClass: 'media-dialog',
      autoFocus: false,
    });
  }
}
