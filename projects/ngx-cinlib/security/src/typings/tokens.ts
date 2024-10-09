import { Maybe } from 'ngx-cinlib/core';

export type RawTokens = {
  access?: Maybe<string>;
  refresh?: Maybe<string>;
};
