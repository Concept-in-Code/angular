import { Maybe } from "ngx-cinlib/core";
import { Observable } from "rxjs";

export type Column<T> = {
  field: string,
  label?: string,
  value?: ((row: T) => Observable<Maybe<string>> | Maybe<string>),
};