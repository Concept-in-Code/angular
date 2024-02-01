import { BrandIcon, RegularIcon, SolidIcon } from 'ngx-cinlib/icons';

export interface RadioButtonInput<T = unknown> {
  icon?: SolidIcon | RegularIcon | BrandIcon;
  label?: string;
  value?: T;
}