import { Maybe } from 'ngx-cinlib/core';
import { QueryConjunction } from './query-conjunction';
import { QueryEntity } from './query-entity';

export type QueryExpression = {
  conjunction?: Maybe<QueryConjunction>;
  entity?: Maybe<QueryEntity>;
};