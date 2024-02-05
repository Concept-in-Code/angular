import { Maybe } from 'ngx-cinlib/core';

export const isValidUrl = (value: Maybe<string>): boolean => {
  try {
    if (value && new URL(value)) {
      return true;
    }
  } catch(_) {
    return false;
  }
  return false;
}