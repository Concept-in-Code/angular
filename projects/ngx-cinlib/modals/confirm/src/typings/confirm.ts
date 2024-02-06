import { Maybe } from 'ngx-cinlib/core';

export enum ConfirmType  {
  Cancel = 'cancel',
  Change = 'change',
  Delete = 'delete',
  Reset = 'reset'
}

export type ConfirmTypeInput = {
  context?: Maybe<string>,
  type: ConfirmType
};

export type ConfirmInput = {
  context?: Maybe<string>
  buttonColor: Maybe<string>,
  buttonLabel: Maybe<string>
  titleLabel: Maybe<string>,
  messageLabel: Maybe<string>,
};

export type Confirm = ConfirmTypeInput
  | ConfirmInput;