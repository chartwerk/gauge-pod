import { GaugeOptions, GaugeTimeSerie, GaugeOptionsUtils } from './types';
import { ChartwerkPod } from '@chartwerk/core';

import * as d3 from 'd3';


export class Pod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {

  constructor(el: HTMLElement, series: GaugeTimeSerie[], options: GaugeOptions) {
    super(
      d3, el, series,
      GaugeOptionsUtils.setChartwerkSuperPodDefaults(options)
    );
  }

  renderMetrics(): void {
    console.log('hey hey');
  }

  /* handlers and overloads */
  onMouseOver(): void {}
  onMouseMove(): void {}
  onMouseOut(): void {}
  renderSharedCrosshair(): void {}
  hideSharedCrosshair(): void {}
}
