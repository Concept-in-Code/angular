import { Maybe } from './maybe';
import { MediaAttribution } from './media-attribution';

export type Media = {
  attribution?: Maybe<MediaAttribution>;
  base64?: Maybe<string>;
  created?: Maybe<any>;
  extension?: Maybe<string>;
  id?: Maybe<string>;
  mimeType?: Maybe<string>;
  modified?: Maybe<any>;
  name?: Maybe<string>;
  size?: Maybe<number>;
  thumbnail?: Maybe<Media>;
  url?: Maybe<string>;
};