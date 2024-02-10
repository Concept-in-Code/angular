import { Maybe } from 'ngx-cinlib/core';

export type Address = {
  created?: any;
  houseNumber?: Maybe<string>;
  latitude?: Maybe<number>;
  longitude?: Maybe<number>;
  modified?: Maybe<any>;
  place?: Maybe<string>;
  postalCode?: Maybe<string>;
  street?: Maybe<string>;
};