import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Maybe } from 'ngx-cinlib/core';
import { CinValidators } from 'ngx-cinlib/forms/validators';
import { I18nDirective, TranslationService } from 'ngx-cinlib/i18n';
import { Observable, combineLatest, filter, isObservable, map, of, switchMap, take } from 'rxjs';
import { Column } from '../typings/column';
import { ExportData } from '../typings/export-data';

@Component({
  selector: 'cin-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    I18nDirective,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
})
export class ExportDialogComponent {

  public form = this.fb.group({
    csv: [false],
    xml: [false],
    json: [false],
    columnSelection: [[] as Column<any>[], [Validators.required]],
  }, { validators: CinValidators.either('csv', 'xml', 'json') });

  public columns = this.data.columns.pipe(
    map(columns => columns?.filter((label) => !!label) as Column<any>[])
  );

  constructor(
    protected translationService: TranslationService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ExportData
  ) {}

  public exportData(): void {
    this.retrieveData()
      .pipe(take(1))
      .subscribe((filteredData) => {

        if (filteredData) {
          if (this.form.value.csv) {
            this.generateDownload(this.convertToCSV(filteredData), 'csv');
          }
          if (this.form.value.xml) {
            this.generateDownload(this.convertToXML(filteredData), 'xml');
          }
          if (this.form.value.json) {
            this.generateDownload(JSON.stringify(filteredData), 'json');
          }
        }
      });
  }

  private retrieveData(): Observable<Maybe<any[]>> {
    return this.data.data.pipe(
      filter(data => !!data?.result?.length),
      switchMap(data => combineLatest(
        (data?.result as any[]).map(item =>
          combineLatest(
            this.form.value.columnSelection?.map((column) =>
              combineLatest([
                this.fieldName(column.label),
                this.fieldValue(item, column),
              ]).pipe(map(([name, value]) => ({ [name]: value })))
            ) || []
          ).pipe(
            map(fields => fields.reduce((acc, curr) => ({ ...acc, ...curr }), {}))
          )
        )
      )),
    );
  }

  private fieldName(label: string | undefined): Observable<string> {
    return this.translationService.getLabel(label).pipe(
      map(translation => translation || '')
    );
  }

  private fieldValue(item: any, column: Column<any>): Observable<any> {
    let fieldValue = item;
    const fieldPath = column.field.split('.');

    if (column.value != null) {
      return isObservable(column?.value?.(item))
        ? (column.value(item) as Observable<any>)
        : of(column.value(item));
    }

    for (const fieldName of fieldPath) {
      if (fieldValue && fieldValue.hasOwnProperty(fieldName)) {
        fieldValue = fieldValue[fieldName];
      }
    }
    return of(fieldValue);
  }

  private convertToCSV(data: any[]): string {
    let csvContent = '';
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent += headers.map(header => header).join(';') + '\n';

      data.forEach((row) => {
        csvContent += headers
          .map((header) => row[header])
          .map((value) => String(value)).join(';') + '\n';
      });
    }

    return csvContent;
  }

  private convertToXML(data: any[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<table>\n';
    data.forEach((item) => {
      xml += '<row>\n';
      Object.keys(item).forEach((key) => {
        xml += `<${key}>${item[key]}</${key}>\n`;
      });
      xml += '</row>\n';
    });
    xml += '</table>';
    return xml;
  }

  private generateDownload(content: string, format: string){
    const url = window.URL.createObjectURL(
      new Blob([content], { type: `data/${format}` })
    );
    
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', `data-export.${format}`);
    element.style.display = 'none';
  
    document.body.appendChild(element);
    element.click();

    //cleanup
    document.body.removeChild(element);
    window.URL.revokeObjectURL(url);
  }
}
