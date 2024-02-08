import { RegularIconsType } from 'ngx-cinlib/icons';
export type ChartAction = {
  label: string,
  icon: RegularIconsType,
  clicked: () => void,
}