import { Maybe, PageableList } from 'ngx-cinlib/core';
import { Observable } from 'rxjs';
import { Column } from './column';

export interface ExportData {
  data: Observable<Maybe<PageableList<any>>>;
  columns: Observable<Maybe<Column<any>[]>>;
};