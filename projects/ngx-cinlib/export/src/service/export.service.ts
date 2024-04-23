import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from '../components/export-dialog.component';
import { ExportData } from '../typings/export-data';

@Injectable()
export class ExportService { 

  constructor(  
   private dialog: MatDialog,
  ) { }  

  public exportData(
    data: ExportData,
  ): void {
    this.dialog.open(ExportDialogComponent, {
      data
    });
  }
}