import { TimeSerie, Options } from '@chartwerk/core';

export enum Stat {
  CURRENT = 'current',
  MIN = 'min',
  MAX = 'max',
  TOTAL = 'total'
}

export type Stop = {
  color: string,
  value: number | null
};

export type ValueFormatter = (value: number) => string;

export type GaugeTimeSerie = TimeSerie;

export type GaugeOptionsParams = {
  innerRadius: number;
  outerRadius: number;
  // TODO: minValue
  maxValue: number;
  minValue: number;
  stops: { color: string , value: number }[];
  defaultColor: string;
  stat: Stat;
  valueFormatter: ValueFormatter;
}
export type GaugeOptions = Options & Partial<GaugeOptionsParams>;
