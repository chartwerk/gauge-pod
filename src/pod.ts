import { GaugeOptions, GaugeTimeSerie, GaugeOptionsUtils } from './types';
import { Gauge } from './gauge';
import { ChartwerkPod } from '@chartwerk/core';

import * as d3 from 'd3';


export class Pod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {

  constructor(
    el: HTMLElement, series: GaugeTimeSerie[],
    protected readonly options: GaugeOptions
   ) {
    super(
      d3, el, series,
      GaugeOptionsUtils.setDefaults(options)
    );
  }

  renderMetrics(): void {
    if (this.series.length === 0 || this.series[0].datapoints.length === 0) {
      this.renderNoDataPointsMessage();
      return;
    }
    new Gauge(this.chartContainer, this.options).render(
      GaugeOptionsUtils.getValueFromDatapoints(this.options, this.series),
      { x: 10, y: 15, width: 50, height: 200 }
    );
  }

  /* handlers and overloads */
  onMouseOver(): void {}
  onMouseMove(): void {}
  onMouseOut(): void {}
  renderSharedCrosshair(): void {}
  hideSharedCrosshair(): void {}
}
