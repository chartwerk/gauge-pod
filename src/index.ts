import { GaugeTimeSerie, GaugeOptions, Stat, Stop } from './types';

import { ChartwerkPod, VueChartwerkPodMixin, ZoomType } from '@chartwerk/core';

import * as d3 from 'd3';

import * as _ from 'lodash';


const DEFAULT_OPTIONS: GaugeOptions = {
  usePanning: false,
  renderLegend: false,
  renderYaxis: false,
  renderXaxis: false,
  renderGrid: false,
  zoom: {
    type: ZoomType.NONE
  },

  stops: [
    {
      color: 'green',
      value: 10
    },
    {
      color: 'yellow',
      value: 20
    }
  ],
  defaultColor: 'red',
  stat: Stat.CURRENT,
  innerRadius: 50,
  outerRadius: 80
};

export class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
  // TODO: better name
  private _gaugeTransform = '';

  constructor(el: HTMLElement, _series: GaugeTimeSerie[] = [], _options: GaugeOptions = {}) {
    super(
      d3, el, _series,
      _.defaults(_options, DEFAULT_OPTIONS)
    );
  }

  renderMetrics(): void {
    if (this.series.length === 0 || this.series[0].datapoints.length === 0) {
      this.renderNoDataPointsMessage();
      return;
    }

    this._gaugeTransform = `translate(${this.width / 2},${this.height - 10})`;

    const arc = d3.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .padAngle(0);

    const pie = d3.pie()
      .startAngle((-1 * Math.PI) / 2)
      .endAngle(Math.PI / 2)
      .sort(null);

    const arcs = pie(this._valueRange);

    this.chartContainer.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .style('fill', (d: object, i: number) => {
        return this._colors[i];
      })
      .attr('d', arc as any)
      .attr('transform', this._gaugeTransform)

    this._renderValueArc();
  }

  // TODO: better name
  private get _valueRange(): number[] {
    // TODO: refactor
    // TODO: max value might be less than the latest stop
    const stopValues = [...this._sortedStops.map(stop => stop.value), this.options.maxValue || this.maxValue];

    if(stopValues.length < 2) {
      return stopValues;
    }
    let range = [stopValues[0]];
    for(let i = 1; i < stopValues.length; i++) {
      range.push(stopValues[i] - stopValues[i-1]);
    }
    return range;
  }

  private get _sortedStops(): Stop[] {
    return _.sortBy(this.options.stops);
  }

  private get _colors(): string[] {
    // TODO: refactor
    return [...this._sortedStops.map(stop => stop.color), this.options.defaultColor];
  }

  private get _stat(): Stat {
    return this.options.stat;
  }

  public get innerRadius(): number {
    return this.options.innerRadius;
  }

  public get outerRadius(): number {
    return this.options.outerRadius;
  }

  private get aggregatedValue(): number {
    switch(this._stat) {
      case Stat.CURRENT:
        return _.last(this.series[0].datapoints)[0];
      // TODO: support other stats
      default:
        throw new Error(`Unsupported stat: ${this._stat}`);
    }
  }

  private get _maxValue(): number {
    return this.options.maxValue || this.maxValue;
  }

  private _renderValueArc(): void {

  }

  /* handlers and overloads */
  onMouseOver(): void {}
  onMouseMove(): void {}
  onMouseOut(): void { }
  renderSharedCrosshair(): void {}
  hideSharedCrosshair(): void {}
}

// it is used with Vue.component, e.g.: Vue.component('chartwerk-gauge-pod', VueChartwerkGaugePodObject)
export const VueChartwerkGaugePodObject = {
  // alternative to `template: '<div class="chartwerk-gauge-pod" :id="id" />'`
  render(createElement) {
    return createElement(
      'div',
      {
        class: { 'chartwerk-gauge-pod': true },
        attrs: { id: this.id }
      }
    )
  },
  mixins: [VueChartwerkPodMixin],
  methods: {
    render() {
      const pod = new ChartwerkGaugePod(document.getElementById(this.id), this.series, this.options);
      pod.render();
    }
  }
};

export { GaugeOptions, GaugeTimeSerie, Stat };
