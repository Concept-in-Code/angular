import { Maybe } from 'ngx-cinlib/core';

export type Language = {
  active?: Maybe<boolean>;
  id?: Maybe<string>;
  locale?: Maybe<string>;
  name?: Maybe<string>;
};