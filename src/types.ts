import { TimeSerie, Options, ZoomType } from '@chartwerk/core';


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
    options.zoom         = { type: ZoomType.NONE };
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

  export function getValueFromDatapoints(
    options: GaugeOptions, series: GaugeTimeSerie[]
  ): number | null {
    // we ignore stat type and always return CURRENT stat
    if(series.length == 0) {
      throw new Error('Series are empty');
    }
    if(series.length > 1) {
      console.warn('got to many series: ' + series.length);
    }
    // we process exactly one serie
    let serie = series[0];
    if(serie.datapoints.length === 0) {
      return null;
    }
    // we take value from position 1, where 0 is time
    return serie.datapoints[serie.datapoints.length - 1][1];
  }
}
