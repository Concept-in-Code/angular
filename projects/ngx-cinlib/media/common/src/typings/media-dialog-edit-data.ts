import { Media } from 'ngx-cinlib/core';
import { MediaEnhanced } from './media-enhanced';

export type MediaEditDialogData = {
  displayCardToggle?: boolean,
  displayTitleToggle?: boolean,
  element: MediaEnhanced | Media,
}