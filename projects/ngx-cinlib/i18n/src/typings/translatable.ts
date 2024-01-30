import { Maybe } from 'ngx-cinlib/core';
import { Language } from './language';

export type Translatable = {
  language?: Maybe<Language>;
  [key: string]: string | Language | undefined | null;
}

export type TranslatableParent = {
  translatables?: Maybe<Maybe<Translatable | undefined>[]> | undefined
}