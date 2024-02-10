import { Maybe } from 'ngx-cinlib/core';
import { Translatable } from 'ngx-cinlib/i18n';

export type Category = {
  id?: Maybe<string>,
  color?: Maybe<string>,
  icon?: Maybe<string>,
  translatables?: Maybe<Maybe<Translatable>[]>,
}