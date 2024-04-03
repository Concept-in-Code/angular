import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Maybe, PageableList } from 'ngx-cinlib/core';
import { PasswordConfirmComponent } from 'ngx-cinlib/forms/password';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { DetailsTitleComponent } from 'ngx-cinlib/layouts/title';
import { FeedbackService } from 'ngx-cinlib/modals/feedback';
import { Observable, take } from 'rxjs';
import { Column } from '../../typings/column';

export interface DialogData {
  list: Observable<Maybe<PageableList<any>>>;
  columns: Observable<Maybe<Column<any>[]>>;
}

export interface TableData {
  field: string,
  label?: string,
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
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExportDataDialogComponent>,
    public feedbackService: FeedbackService,
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
    if(this.exportableData){
    const csvData = this.convertToCSV(this.exportableData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    }
    // saveAs(blob, 'data.csv');
  }

  private convertToCSV(data: any[]): string {
    const fields = Object.keys(data[0]);
    const csv = [
      fields.join(','),
      ...data.map(item => fields.map(field => item[field]).join(','))
    ];
    return csv.join('\n');
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

            fieldPath.forEach(fieldName => {
                if (fieldValue && fieldValue.hasOwnProperty(fieldName)) {
                    fieldValue = fieldValue[fieldName];
                } else {
                    fieldValue = null;
                }
            });
          
            const prefix = fieldPath[fieldPath.length - 1];   

            filteredItem[prefix] = fieldValue;
        });

        return filteredItem;
    });
    console.log("filtered", filteredList);
    return filteredList;
}

}