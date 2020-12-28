import { TimeSerie, Options } from '@chartwerk/core';


export type GaugeTimeSerie = TimeSerie;

/**
 * The way to choose one value from metrics
 */
export enum Stat {
  CURRENT = 'current',
  // MIN     = 'min',
  // MAX     = 'max',
  // TOTAL   = 'total'
}

export type Range = {
  from: number,
  to: number    // should be >= from
}

export type Threshold = {
  value: number,
  color: string
}

// this `type` should be `class` and get all functions
// from GaugeOptionsUtils as methods;
//
// all fields with "?" should be inited in constructor
// with default values, "?" should be removed after
export type GaugeOptions = Options & {
  stat:         Stat,
  range?:       Range
  thresholds?:  Threshold[] // should be sorted and inside range
}

/***** OPTIONS UTILS ******/
/*
 * chartwerk core is garbage. We can't make our options to be a class,
 * because `chartwerk.core.Options` is a type, not a class..
 */

export namespace GaugeOptionsUtils {
  export function setChartwerkSuperPodDefaults(options: GaugeOptions): GaugeOptions { 
    options.usePanning   = false;
    options.renderLegend = false;
    options.renderYaxis  = false;
    options.renderXaxis  = false;
    options.renderGrid   = false;
    return options;
  }

  export function setDefaults(options: GaugeOptions) {
    setChartwerkSuperPodDefaults(options);
    if(options.range === undefined) {
      options.range = { from: 0, to: 100 };
    }
    if(options.range === undefined) {
      options.thresholds = [];
    }
    return options;
  }
}
