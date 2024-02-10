import { Maybe } from './maybe';

export type User = {
  firstName?: Maybe<string>,
  lastName?: Maybe<string>,
}