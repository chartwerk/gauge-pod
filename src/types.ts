import { TimeSerie, Options } from '@chartwerk/core';


export type GaugeTimeSerie = TimeSerie;

/**
 * The way to choose one value from metrics
 */
export enum Stat {
  CURRENT,
  MIN,
  MAX,
  TOTAL
}

export type GaugeOptions = Options & {
  stat: Stat
  innerRadius: number;
  outerRadius: number;
}
