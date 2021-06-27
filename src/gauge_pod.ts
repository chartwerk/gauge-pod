import { GaugeOptions, GaugeTimeSerie, GaugeOptionsUtils } from './types';
import { Gauge } from './gauge';
import { ChartwerkPod } from '@chartwerk/core';

import * as d3 from 'd3';


export class GaugeChartwerkPod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {

  constructor(
    el: HTMLElement,
    _series: GaugeTimeSerie[], // TODO: remove this
    _options: GaugeOptions
   ) {
    super(
      d3, el, _series,
      GaugeOptionsUtils.setDefaults(_options)
    );
  }

  renderMetrics(): void {
    let value;
    if (this.series.length === 0 || this.series[0].datapoints.length === 0) {
      value = undefined;
    } else {
      value = this.series[this.series.length - 1].datapoints[0][0]
    }
    let g = new Gauge(this.chartContainer, this.options).render(
      { x: 0, y: 0, width: this.width, height: this.height },
      value
    );
  }

  render() {
    // Optimisation of rendering: we need only svg holder
    this.renderSvg();
    this.renderMetrics();
  }

  /* handlers and overloads */
  onMouseOver(): void {}
  onMouseMove(): void {}
  onMouseOut(): void {}
  renderSharedCrosshair(): void {}
  hideSharedCrosshair(): void {}
}
