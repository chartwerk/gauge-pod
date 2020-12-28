import { GaugeOptions, GaugeTimeSerie, GaugeOptionsUtils } from './types';
import { Gauge } from './gauge';
import { ChartwerkPod } from '@chartwerk/core';

import * as d3 from 'd3';


export class Pod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {

  constructor(el: HTMLElement, series: GaugeTimeSerie[], protected readonly options: GaugeOptions) {
    super(
      d3, el, series,
      GaugeOptionsUtils.setDefaults(options)
    );
  }

  renderMetrics(): void {
    new Gauge(this.d3Node, this.options).render();
  }

  /* handlers and overloads */
  onMouseOver(): void {}
  onMouseMove(): void {}
  onMouseOut(): void {}
  renderSharedCrosshair(): void {}
  hideSharedCrosshair(): void {}
}
