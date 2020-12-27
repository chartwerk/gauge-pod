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

/***** OPTIONS UTILS ******/
/*
 * chartwerk core is garbage. We can't make our options to be a class,
 * because `chartwerk.core.Options` is a type, not a class..
 */

export namespace GaugeOptionsUtils {
  export function setChartwerkSuperPodDefaults(options: GaugeOptions): GaugeOptions { 
    options.usePanning = false;
    options.renderLegend = false;
    options.renderYaxis = false;
    options.renderXaxis = false;
    options.renderGrid = false;
    return options;
  }
}
