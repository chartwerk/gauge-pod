import { GaugeTimeSerie, GaugeOptions, Stat, Stop } from './types';

import { ChartwerkPod, VueChartwerkPodMixin, ZoomType } from '@chartwerk/core';

import { findClosest } from './utils';

import * as d3 from 'd3';

import * as _ from 'lodash';

const SPACE_BETWEEN_CIRCLES = 2;
const CIRCLES_ROUNDING = 0.15; //radians
const BACKGROUND_COLOR = 'rgba(38, 38, 38, 0.1)';
const DEFAULT_INNER_RADIUS = 48;
const DEFAULT_OUTER_RADIUS = 72;
const STOPS_CIRCLE_WIDTH = 4;
const VALUE_TEXT_FONT_SIZE = 16;
const DEFAULT_VALUE_TEXT_Decimals = 2;
const VALUE_TEXT_MARGIN = 10;

const DEFAULT_GAUGE_OPTIONS: GaugeOptions = {
  usePanning: false,
  renderLegend: false,
  renderYaxis: false,
  renderXaxis: false,
  renderGrid: false,
  zoom: {
    type: ZoomType.NONE
  },
  margin: {
    top: 0, bottom: 0,
    left: 0, right: 0
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
  innerRadius: DEFAULT_INNER_RADIUS,
  outerRadius: DEFAULT_OUTER_RADIUS,
  valueTextFormat: {
    decimals: DEFAULT_VALUE_TEXT_Decimals
  }
};

export class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
  // TODO: better name
  private _gaugeTransform = '';
  private _gaugeCenter = '';
  private _minWH = 0;

  constructor(el: HTMLElement, _series: GaugeTimeSerie[] = [], _options: GaugeOptions = {}) {
    super(
      d3, el, _series,
      _.defaults(_options, DEFAULT_GAUGE_OPTIONS)
    );
  }

  renderMetrics(): void {
    if(this.series.length === 0 || this.series[0].datapoints.length === 0) {
      this.renderNoDataPointsMessage();
      return;
    }

    this._setBoundingBox();
    this._renderValueArc();
    this._renderThresholdArc();
    this._renderValue();
  }

  private _setBoundingBox(): void {
    // TODO: refactor
    this._gaugeTransform = `translate(${this.width / 2},${0.8 * this.height})`;
    this._gaugeCenter = `translate(${this.width / 2 + this.margin.left},${0.8 * this.height})`;

    this._minWH = _.min([0.6 * this.width, this.height]);
  }

  private _renderValue(): void {
    this.svg
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(this._valueText)
      .classed('value-text', true)
      .attr('font-family', 'Roboto, "Helvetica Neue", Arial, sans-serif')
      .attr('font-size', `${this._valueTextFontSize}px`)
      .attr('transform', this._gaugeCenter)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('fill', this._mainCircleColor);
  }

  private _renderValueArc(): void {
    const arc = d3.arc()
      .innerRadius(this._innerRadius)
      .outerRadius(this._outerRadius)
      .padAngle(0);

    const valueArcs = this._d3Pie(this._valueRange);
    this.chartContainer.selectAll(null)
      .data(valueArcs)
      .enter()
      .append('path')
      .style('fill', (d: object, i: number) => {
        return this._valueArcColors[i];
      })
      .attr('d', arc as any)
      .attr('transform', this._gaugeTransform);
  }

  private _renderThresholdArc(): void {
    if(this._sortedStops.length === 0) {
      return;
    }
    const thresholdInnerRadius = this._outerRadius + SPACE_BETWEEN_CIRCLES;
    // TODO: move to options
    const thresholdOuterRadius = thresholdInnerRadius + STOPS_CIRCLE_WIDTH;
    const thresholdArc = d3.arc()
      .innerRadius(thresholdInnerRadius)
      .outerRadius(thresholdOuterRadius)
      .padAngle(0);

    const stopArcs = this._d3Pie(this._stopsRange);
    this.chartContainer.selectAll(null)
      .data(stopArcs)
      .enter()
      .append('path')
      .style('fill', (d: object, i: number) => {
        return this._colors[i];
      })
      .attr('d', thresholdArc as any)
      .attr('transform', this._gaugeTransform);
  }

  private get _d3Pie(): d3.Pie<any, { valueOf(): number; }> {
    return d3.pie()
      .startAngle((-1 * Math.PI) / 2 - CIRCLES_ROUNDING)
      .endAngle(Math.PI / 2 + CIRCLES_ROUNDING)
      .sort(null);
  }

  private get _valueArcColors(): [string, string] {
    return [this._mainCircleColor, BACKGROUND_COLOR];
  }

  private get _mainCircleColor(): string {
    if(this.aggregatedValue > _.max(this._stopsValues) || this.aggregatedValue < 0 || this._sortedStops.length === 0) {
      // TODO: aggregatedValue can be less than 0
      return this.options.defaultColor;
    }
    // TODO: refactor
    const closestIdx = findClosest(this._stopsValues, this.aggregatedValue);
    const closestStop = this._sortedStops[closestIdx];
    if(this.aggregatedValue > closestStop.value) {
      return this._sortedStops[closestIdx + 1].color;
    } else {
      return closestStop.color;
    }
  }

  // TODO: better name
  private get _stopsRange(): number[] {
    // TODO: refactor
    // TODO: max value might be less than the latest stop
    const stopValues = [...this._stopsValues, this._maxValue];

    if(stopValues.length < 2) {
      return stopValues;
    }
    let range = [stopValues[0]];
    for(let i = 1; i < stopValues.length; i++) {
      range.push(stopValues[i] - stopValues[i-1]);
    }
    return range;
  }

  private get _valueRange(): [number, number] {
    return [this.aggregatedValue, this._maxValue - this.aggregatedValue];
  }

  private get _sortedStops(): Stop[] {
    return _.sortBy(this.options.stops);
  }

  private get _stopsValues(): number[] {
    return this._sortedStops.map(stop => stop.value);
  }

  private get _colors(): string[] {
    // TODO: refactor
    return [...this._sortedStops.map(stop => stop.color), this.options.defaultColor];
  }

  private get _valueText(): string {
    const decimalsCount = this._valueTextDecimals;
    return this.aggregatedValue.toFixed(decimalsCount);
  }

  private get _valueTextFontSize(): number {
    let font;
    if(this._valueText.length <= 6) {
      font = VALUE_TEXT_FONT_SIZE;
    } else if(this._valueText.length > 6 && this._valueText.length <= 10) {
      font = VALUE_TEXT_FONT_SIZE - 2;
    } else if(this._valueText.length > 10 && this._valueText.length <= 12) {
      font = VALUE_TEXT_FONT_SIZE - 4;
    } else {
      font = VALUE_TEXT_FONT_SIZE - 6;
    }
    return this.rescaleValueFont(font);
  }

  private get _stat(): Stat {
    return this.options.stat;
  }

  private get _innerRadius(): number {
    // TODO: scale shouldn't be here
    return this.rescaleArcRadius(this.options.innerRadius);
  }

  private get _outerRadius(): number {
    // TODO: scale shouldn't be here
    return this.rescaleArcRadius(this.options.outerRadius);
  }

  rescaleArcRadius(radius: number): number {
    return radius * this._scaleFactor;
  }

  rescaleValueFont(fontsize: number): number {
    const scale = 0.8 * this._scaleFactor;
    return fontsize * scale;
  }

  private get _scaleFactor(): number {
    const stopOuterRadius = this.options.outerRadius + SPACE_BETWEEN_CIRCLES + STOPS_CIRCLE_WIDTH;
    const marginForRounded = VALUE_TEXT_MARGIN + 10;
    const scale = this._minWH / (stopOuterRadius + marginForRounded);
    return scale;
  }

  private get _valueTextDecimals(): number {
    if(this.options.valueTextFormat === undefined) {
      throw new Error(`Options has no valueTextFormat`);      
    }
    return this.options.valueTextFormat.decimals;
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
