import { Maybe } from './maybe';

export type MediaAttribution = {
  author?: Maybe<string>;
  created?: Maybe<string>;
  id?: Maybe<string>;
  license?: Maybe<string>;
  modified?: Maybe<string>;
  source?: Maybe<string>;
  title?: Maybe<string>;
};