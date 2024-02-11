import { Maybe } from 'ngx-cinlib/core';
import { Observable } from 'rxjs';
import { ColumnType } from './column-type';

export type Column<T> = {
  editable?: boolean,
  field: string,
  label?: string,
  sort?: boolean,
  type?: ColumnType,
  value?: ((row: T) => Observable<Maybe<string>> | Maybe<string>),
};