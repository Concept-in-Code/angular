import { Maybe } from '@cinlib/ui/core';

export type Language = {
  active?: Maybe<boolean>;
  id?: Maybe<string>;
  locale?: Maybe<string>;
  name?: Maybe<string>;
};