import { Maybe } from './maybe';
import { Media } from './media';

export type UserContextMedia = {
  profilePicture?: Maybe<boolean>,
  title?: Maybe<boolean>,
  media?: Maybe<Media>,
}