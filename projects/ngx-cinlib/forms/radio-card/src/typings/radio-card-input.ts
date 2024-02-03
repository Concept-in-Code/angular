import { BrandIcon, RegularIcon, SolidIcon } from 'ngx-cinlib/icons';

export interface RadioCardInput {
  display?: string,
  icon: SolidIcon | RegularIcon | BrandIcon;
  label?: string;
  value?: unknown;
}