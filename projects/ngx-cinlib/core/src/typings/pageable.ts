import { Maybe } from './maybe';

export type PageableList<T> = {
  result?: Maybe<Array<Maybe<T>>>;
  total?: number;
};