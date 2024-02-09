import { Maybe } from 'ngx-cinlib/core';

export type Tokens = {
  access?: Maybe<string>;
  refresh?: Maybe<string>;
};