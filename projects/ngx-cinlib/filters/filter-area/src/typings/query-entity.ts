import { Maybe } from 'ngx-cinlib/core';
import { QueryOperator } from './query-operator';

export type QueryEntity = {
  operator?: Maybe<QueryOperator>;
  path?: Maybe<string>;
  value?: Maybe<string>;
};
