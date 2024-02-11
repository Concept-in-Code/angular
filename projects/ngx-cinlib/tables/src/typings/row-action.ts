import { Maybe } from 'ngx-cinlib/core';
import { SolidIconsType } from 'ngx-cinlib/icons';

export type RowCustomAction<T> = {
  callback?: (row: Maybe<T>) => void,
  disable?: (row: Maybe<T>) => boolean,
  icon: SolidIconsType,
  inlineEdit?: boolean,
  privileges?: string[],
  tooltipLabel?: Maybe<string>,
};

export type RowActionComponentInput = {
  component: any,
  inputs?: {
    [key: string]: any;
  }
};

export type RowActionComponent<T> = (row: T) => RowActionComponentInput

export type RowAction<T> = RowCustomAction<T> | RowActionComponent<T>;