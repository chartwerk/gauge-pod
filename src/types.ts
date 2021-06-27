import { TimeSerie, Options } from '@chartwerk/core';


export type GaugeTimeSerie = TimeSerie;

// TODO: move to core
export type BoundingBox = {
  x: number, y: number,
  width: number, height:number
}

export type Range = {
  from: number,
  to: number    // should be >= from
}


// this `type` should be `class` and get all functions
// from GaugeOptionsUtils as methods;
//
// all fields with "?" should be inited in constructor
// with default values, "?" should be removed after
export type GaugeOptions = Options & {
  range?:                Range,
  thresholds?:           {       // colors array should be values.length + 1
    values: number[], 
    colors: string[] 
  }, 
  arcThickness?:         number, // scale factor for arc innner radius
  curvature?:            number, // length of arc from 0..2 (where 2 is circle)
  thresholdsThickness?:  number
  thresholdsOffset?:     number,
  valueArcColor?:        string  // used only if thresholds not defined
  backgroundArcColor?:   string  // used only if thresholds not defined
  valueFormatter?:       (n?: number) => string
}

/***** OPTIONS UTILS ******/
/*
 * chartwerk core is garbage. We can't make our options to be a class,
 * because `chartwerk.core.Options` is a type, not a class..
 */
export namespace GaugeOptionsUtils {
  export function setChartwerkSuperPodDefaults(options: GaugeOptions): GaugeOptions { 
    options.renderLegend = false;
    options.renderGrid   = false;
    options.margin       = { top: 0, right: 0, bottom: 0, left: 0 };
    options.axis         = { x: { isActive: false }, y: { isActive: false }};
    options.zoomEvents   = {
      mouse: {
        zoom: { isActive: false },
        pan: { isActive: false }
      },
      scroll: {
        zoom: { isActive: false },
        pan: { isActive: false }
      }
    }
    
    return options;
  }

  export function setDefaults(options: GaugeOptions) {
    setChartwerkSuperPodDefaults(options);
    if(options.range === undefined) {
      options.range = { from: 0, to: 100 };
    }
    if (options.arcThickness == undefined) {
      options.arcThickness = 0.2;
    }
    if (options.curvature == undefined) {
      options.curvature = 1.5;
    }
    if (options.thresholdsThickness == undefined) {
      options.thresholdsThickness = 0.1;
    }
    if (options.thresholdsOffset == undefined) {
      options.thresholdsOffset = 0.05;
    }
    if (options.valueArcColor == undefined) {
      options.valueArcColor = 'blue';
    }
    if (options.backgroundArcColor == undefined) {
      options.backgroundArcColor = 'gray';
    }
    return options;
  }
}
