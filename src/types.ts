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

export type IconConfig = {
  src: string,
  position: IconPosition,
  size: number
}
export enum IconPosition {
  LEFT = 'left',
  MIDDLE = 'middle',
  RIGHT = 'right'
}

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
  icons: IconConfig[];
  valueFontSize: number;
  valueArcBackgroundColor: string;
  reversed: boolean;
  enableThresholdLabels: boolean; // render threshold values as a text under the gauge
  enableExtremumLabels: boolean; // render min/max values as a text above the gauge
}
export type GaugeOptions = Options & Partial<GaugeOptionsParams>;
