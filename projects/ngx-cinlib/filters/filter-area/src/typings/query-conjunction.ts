import { Maybe } from 'ngx-cinlib/core';
import { ConjunctionOperator } from './conjunction-operator';
import { QueryExpression } from './query-expression';

export type QueryConjunction = {
  operands?: Maybe<Array<Maybe<QueryExpression>>>;
  operator?: Maybe<ConjunctionOperator>;
};