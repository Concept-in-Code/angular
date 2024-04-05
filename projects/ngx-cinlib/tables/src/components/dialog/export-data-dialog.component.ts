import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatOptionModule
} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Maybe, PageableList } from 'ngx-cinlib/core';
import { PasswordConfirmComponent } from 'ngx-cinlib/forms/password';
import { I18nDirective, TranslationService } from 'ngx-cinlib/i18n';
import { DetailsTitleComponent } from 'ngx-cinlib/layouts/title';
import { Observable, combineLatest, isObservable, map, of, take } from 'rxjs';
import { Column } from '../../typings/column';

export interface DialogData {
  list: Observable<Maybe<PageableList<any>>>;
  columns: Observable<Maybe<Column<any>[]>>;
}

@Component({
  selector: 'common-export-data-dialog',
  templateUrl: './export-data-dialog.component.html',
  styleUrls: ['./export-data-dialog.component.scss'],
  standalone: true,
  imports: [
    DetailsTitleComponent,
    I18nDirective,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    PasswordConfirmComponent,
    ReactiveFormsModule,
  ],
})
export class ExportDataDialogComponent implements OnInit {
  public form = this.fb.group({
    csv: [false],
    xml: [false],
    json: [false],
    columnSelection: [[] as Column<any>[], [Validators.required]],
  });

  public possibleFields?: Maybe<Column<any>[]>;

  private exportableData?: Maybe<any[]>;

  private columns?: Maybe<Column<any>[]>;

  constructor(
    protected translationService: TranslationService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.data.list
      .pipe(take(1))
      .subscribe((list) => (this.exportableData = list?.result));

    this.data.columns.pipe(take(1)).subscribe((columns) => {
      this.possibleFields = columns
        ?.map((column) => ({
          field: column.field,
          label: column.label,
          value: column.value,
        }))
        .filter((label) => !!label) as Column<any>[];
      this.columns = columns;
    });
  }

  exportData() {
    if (this.exportableData) {
      this.filterData(this.exportableData).subscribe((filteredData) => {

        if (filteredData) {
          if (this.form.value.csv) {
            this.generateDownload(this.convertToCSV(filteredData), "csv");
          }
          if (this.form.value.xml) {
            this.generateDownload(this.convertToXML(filteredData), "xml");
          }
          if (this.form.value.json) {
            this.generateDownload(JSON.stringify(filteredData), "json");
          }
        }
      });
    }
  }

  private filterData(list: any[]): Observable<Maybe<any[]>> {
    return combineLatest(
      list.map((item) =>
        combineLatest(
          this.form.value.columnSelection?.map((column) =>
            combineLatest([
              this.translateItemLabel(column.label),
              this.processListItem(item, column),
            ]).pipe(
              map(([label, value]) => {
                return { [label]: value };
              })
            )
          ) || []
        ).pipe(
          map((fields) => {
            return fields.reduce((acc, curr) => ({ ...acc, ...curr }), {});
          })
        )
      )
    );
  }

  private processListItem(item: any, column: Column<any>): Observable<any> {
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

  private translateItemLabel(label: string | undefined): Observable<string> {
    return this.translationService.getLabel(label).pipe(
      take(1),
      map((translation) => translation || '')
    );
  }

  private convertToCSV(data: any[]): string {
    const escapeCSVValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
      } else {
        return value;
      }
    };

    let csvContent = '';
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent +=
        headers.map((header) => escapeCSVValue(header)).join(';') + '\n';

      data.forEach((row) => {
        const values = headers.map((header) => row[header]);
        csvContent +=
          values.map((value) => escapeCSVValue(String(value))).join(';') + '\n';
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
    const element = document.createElement('a');
    const blob = new Blob([content], { type: `data/${format}` });
  
    const url = window.URL.createObjectURL(blob);
    element.setAttribute('href', url);
    element.setAttribute('download', `data-export.${format}`);
    element.style.display = 'none';
  
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  
    window.URL.revokeObjectURL(url);
  }
}
