import { Maybe, Media } from 'ngx-cinlib/core';

export type MediaEnhanced = {
  id?: Maybe<string>,
  card?: Maybe<boolean>,
  title?: Maybe<boolean>,
  media: Media,
}