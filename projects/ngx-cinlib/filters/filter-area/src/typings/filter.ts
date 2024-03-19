import { Maybe } from 'ngx-cinlib/core';
import { QueryExpression } from './query-expression';

export type Filter = {
  expression?: Maybe<QueryExpression>;
  search?: Maybe<string>;
};