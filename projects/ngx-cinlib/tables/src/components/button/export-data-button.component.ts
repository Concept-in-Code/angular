import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { TableService } from '../../services/table.service';
import { ExportDataDialogComponent } from '../dialog/export-data-dialog.component';



@Component({
  selector: 'cin-export-data-button',
  templateUrl: './export-data-button.component.html',
  styleUrls: ['./export-data-button.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    IconComponent,
    I18nDirective
  ]
})
export class ExportDataButtonComponent { 

  constructor(  
   private dialog: MatDialog,
   private tableService: TableService
  ) { }  

  openExportDialog() {
    this.dialog.open(ExportDataDialogComponent, {
        data: {list: this.tableService.getData(),
           columns: this.tableService.getColumns()}
      })
    }  
}