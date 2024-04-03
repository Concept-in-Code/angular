import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Maybe, PageableList } from 'ngx-cinlib/core';
import { PasswordConfirmComponent } from 'ngx-cinlib/forms/password';
import { I18nDirective, TranslationService } from 'ngx-cinlib/i18n';
import { DetailsTitleComponent } from 'ngx-cinlib/layouts/title';
import { Observable, take } from 'rxjs';
import { Column } from '../../typings/column';

export interface DialogData {
  list: Observable<Maybe<PageableList<any>>>;
  columns: Observable<Maybe<Column<any>[]>>;
}

export interface TableData {
  field: string,
  label: string,
  value?:  ((row: any) => Observable<Maybe<string>> | Maybe<string>),
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
    MatPseudoCheckboxModule,
    PasswordConfirmComponent,
    ReactiveFormsModule,
  ]
})
export class ExportDataDialogComponent implements OnInit{ 

  public form = this.fb.group({
    csv: [false],
    xml: [false],
    json: [false],
    fieldSelection: [[] as TableData[], [Validators.required]]
  });

  public possibleFields?: Maybe<TableData[]>;

  private exportableData?: Maybe<any[]>;

  private columns?: Maybe<Column<any>[]>;

  constructor(  
    protected translationService: TranslationService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}  

  ngOnInit(): void {
    this.data.list.pipe(take(1)).subscribe(list => 
      this.exportableData = list?.result
      );
     
      this.data.columns.pipe(take(1)).subscribe(columns => {
        this.possibleFields = columns?.map(column => ({ field: column.field, label: column.label, value: column.value }))
        .filter(label => !!label) as TableData[];
        this.columns = columns;
    });
        console.log(this.exportableData);
        console.log(this.columns);
  }
  
  exportData() {
    console.log("fieldSelection",this.form.value.fieldSelection);

    this.data.list.pipe(take(1)).subscribe(data => this.exportableData = this.filterData(data?.result));
      
    if (this.form.value.csv) {
      this.exportToCSV();
    }
    if (this.form.value.xml) {
      this.exportToXML();
    }
    if (this.form.value.json) {
      this.exportToJSON();
    }
  }
  


  exportToCSV() {
    const csvContent = this.convertToCSV(this.exportableData!);
    const element = document.createElement('a');
    const blob = new Blob([csvContent], { type: 'data/csv' });
    const url = window.URL.createObjectURL(blob);

    element.setAttribute('href', url);
    element.setAttribute('download', 'primer-server-task.csv');
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    window.URL.revokeObjectURL(url);
}

convertToCSV(data: any[]): string {
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
        csvContent += headers.map(header => escapeCSVValue(header)).join(';') + '\n';

        data.forEach(row => {
            const values = headers.map(header => row[header]);
            csvContent += values.map(value => escapeCSVValue(String(value))).join(';') + '\n';
        });
    }

    return csvContent;
}


  exportToXML() {
    if (this.exportableData){
    const xmlData = this.convertToXML(this.exportableData);
    // Perform action to save or display XML data
    console.log(xmlData);
    }
  }

  exportToJSON() {
    var sJson = JSON.stringify(this.exportableData);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', "primer-server-task.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
  }

  private convertToXML(data: any[]): string {
    // Convert array of objects to XML format
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<table>\n';
    data.forEach(item => {
      xml += '  <row>\n';
      Object.keys(item).forEach(key => {
        xml += `    <${key}>${item[key]}</${key}>\n`;
      });
      xml += '  </row>\n';
    });
    xml += '</table>';
    return xml;
  }

  private filterData(list: Maybe<any[]>): Maybe<any[]> {
    

    const filteredList = list?.map(item => {
        const filteredItem: any = {};
        this.form.value.fieldSelection?.forEach(tableData => {
            const fieldPath = tableData.field.split('.'); 

            let fieldValue = item;

            for (const fieldName of fieldPath) {
                if (fieldValue && fieldValue.hasOwnProperty(fieldName)) {
                  // console.log("fieldValue[fieldName]", fieldValue = fieldValue[fieldName]);
                  // console.log("fieldvalue[fn]item", fieldValue = fieldValue[fieldName](item));
                  if(tableData.value != null) {
                    fieldValue = tableData.value(item);
                    
                  } else {
                    fieldValue = fieldValue[fieldName];
                  }
                } else {
                    fieldValue = null;
                    break; 
                }
            }

            if (tableData.label) {
                this.translationService.getLabel(tableData.label).subscribe(translation => {
                    if (translation) {
                        filteredItem[translation] = fieldValue;
                    }
                });
            }
        });

        return filteredItem;
    });

    return filteredList;
}

}