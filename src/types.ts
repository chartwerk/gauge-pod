import { TimeSerie, Options } from '@chartwerk/base';

export enum Stat {
  CURRENT = 'current',
  MIN = 'min',
  MAX = 'max',
  TOTAL = 'total'
}

export type GaugeTimeSerie = TimeSerie;

export type GaugeOptionsParams = {
  innerRadius: number;
  outerRadius: number;
  // TODO: minValue
  maxValue: number;
  stops: number[];
  colors: string[];
  stat: Stat;
}
export type GaugeOptions = Options & Partial<GaugeOptionsParams>;
