import { GaugeTimeSerie, GaugeOptions, Stat, Stop, IconConfig, IconPosition, PointCoordinate } from './types';

import { ChartwerkPod, VueChartwerkPodMixin, AxisFormat, CrosshairOrientation } from '@chartwerk/core';

import { findClosest } from './utils';

import * as d3 from 'd3';

import * as _ from 'lodash';

const SPACE_BETWEEN_CIRCLES = 2;
const CIRCLES_ROUNDING = 0.25; //radians
const BACKGROUND_COLOR = 'rgba(38, 38, 38, 0.1)';
const DEFAULT_INNER_RADIUS = 52;
const DEFAULT_OUTER_RADIUS = 72;
const STOPS_CIRCLE_WIDTH = 8;
const DEFAULT_VALUE_TEXT_FONT_SIZE = 16;
const DEFAULT_VALUE_TEXT_Decimals = 2;
const VALUE_TEXT_MARGIN = 10;
const DEFAULT_ICON_SIZE = 20; //px

const DEFAULT_GAUGE_OPTIONS: GaugeOptions = {
  renderLegend: false,
  renderGrid: false,
  zoomEvents: {
    mouse: {
      zoom: {
        isActive: false,
      },
      pan: {
        isActive: false
      },
    },
    scroll: {
      zoom: {
        isActive: false
      },
      pan: {
        isActive: false,
      }
    },
  },
  axis: {
    x: { isActive: false, format: AxisFormat.NUMERIC },
    y: { isActive: false, format: AxisFormat.NUMERIC },
    y1: { isActive: false, format: AxisFormat.NUMERIC },
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
  crosshair: {
    orientation: CrosshairOrientation.VERTICAL,
    color: 'red'
  },
  defaultColor: 'red',
  stat: Stat.CURRENT,
  innerRadius: DEFAULT_INNER_RADIUS,
  outerRadius: DEFAULT_OUTER_RADIUS,
  icons: [],
  valueFontSize: null,
  valueArcBackgroundColor: BACKGROUND_COLOR,
  reversed: false,
  enableExtremumLabels: false,
  enableThresholdLabels: false,
  enableThresholdDrag: false,
};

export class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
  _draggableLines: any[] = [];
  _draggedThresholdValues: number[] = []; // threshold values after dragging
  _thresholdArc: any | null = null;
  _thresholdTextLabels: any[] = [];

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
    this._renderOverlayBackground();
    this._renderValueArc();
    this._renderThresholdArc();
    this._renderDraggableLines();
    this._renderValue();
    this._renderIcons();
    this._renderLabels();
  }

  protected updateOptions(newOptions: GaugeOptions): void {
    if(newOptions === undefined) {
      return;
    }
    let options = _.cloneDeep(newOptions);
    _.defaultsDeep(options, DEFAULT_GAUGE_OPTIONS);
    this.options = options;
  }

  get _gaugeTransform(): string {
    return `translate(${this.width / 2},${0.8 * this.height})`;
  }

  get _gaugeCenterTranform(): string {
    return `translate(${this._gaugeCenterCoordinate.x},${this._gaugeCenterCoordinate.y})`;
  }

  get _gaugeCenterCoordinate(): { x: number, y: number} {
    // TODO: 0.8 is the hardcoded value. It can be calculated
    return {
      x: this.width / 2 + this.margin.left,
      y: 0.8 * this.height
    }
  }

  get _minWH(): number {
    // TODO: 0.6 is the hardcoded value. It can be calculated
    return _.min([0.6 * this.width, this.height]);
  }

  private _renderIcons(): void {
    if(this.options.icons === undefined || this.options.icons.length === 0) {
      return;
    }
    this.options.icons.map(icon => {
      this._renderIcon(icon);
    });
  }

  private _renderIcon(icon: IconConfig): void {
    if(icon.src === undefined || icon.src.length === 0) {
      return;
    }
    this.svg
      .append('image')
      .attr('xlink:href', icon.src)
      .attr('x', this._getIconPosition(icon).x)
      .attr('y', this._getIconPosition(icon).y)
      .attr('width', `${this._getIconSize(icon)}px`)
      .attr('height', `${this._getIconSize(icon)}px`)
      .attr('pointer-events', 'none');
  }

  private _getIconPosition(icon: IconConfig): { x: number, y: number } {
    const iconXCenter = this._gaugeCenterCoordinate.x - this._getIconSize(icon) / 2;
    const iconYCenter = 0.8 * this.height - this._getIconSize(icon) / 2;

    switch(icon.position) {
      case IconPosition.LEFT:
        // TOOD: refactor, it can be calculated by Math.sin, Math.cos
        const leftX = iconXCenter - this._innerRadius;
        const leftY = iconYCenter - 0.8 * this._outerRadius;
        return { x: leftX, y: leftY }
      case IconPosition.MIDDLE:
        const middleX = iconXCenter;
        const middleY = iconYCenter - 0.6 * this._innerRadius;
        return { x: middleX, y: middleY }
      case IconPosition.RIGHT:
        const rightX = iconXCenter + this._innerRadius;
        const rightY = iconYCenter - 0.8 * this._outerRadius;
        return { x: rightX, y: rightY }
      default:
        throw new Error(`Unknown type of icon position: ${icon.position}`);
    }
  }

  private _getIconSize(icon: IconConfig): number {
    if(icon.size === undefined) {
      return this.rescaleWith(DEFAULT_ICON_SIZE);
    }
    return this.rescaleWith(icon.size);
  }

  protected _renderOverlayBackground(): void {
    this.svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height)
      .classed('overlay', true)
      .attr('pointer-events', 'all')
      .attr('fill', 'none')
      .on('mouseover', this.onGaugeMouseOver.bind(this))
      .on('mouseout', this.onGaugeMouseOut.bind(this))
      .on('mousemove', this.onGaugeMouseMove.bind(this));
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
      .attr('transform', this._gaugeCenterTranform)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('pointer-events', 'none')
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
      .attr('class', (d: object, i: number) => {
        if(i === 0) {
          return 'value-arc';
        } else {
          return 'backgroung-arc'
        }
      })
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
    const thresholdArc = this._getThresholdArc();

    const stopArcs = this._d3Pie(this._getStopsRange(this._stopsValues));
    this._thresholdArc = this.chartContainer.selectAll(null)
      .data(stopArcs)
      .enter()
      .append('path')
      .attr('class', (d: object, i: number) => {
        return `stop-arc-${i}`;
      })
      .style('fill', (d: object, i: number) => {
        return this._colors[i];
      })
      .attr('d', thresholdArc as any)
      .attr('transform', this._gaugeTransform);
  }

  protected _getThresholdArc(): d3.Arc<any, d3.DefaultArcObject> {
    const spaceBetweenCircles = this.rescaleSpace(SPACE_BETWEEN_CIRCLES);
    const thresholdInnerRadius = this._outerRadius + spaceBetweenCircles;
    const stopCircleWidth = this.rescaleWith(STOPS_CIRCLE_WIDTH);
    // TODO: move to options
    const thresholdOuterRadius = thresholdInnerRadius + stopCircleWidth;
    const arc = d3.arc()
      .innerRadius(thresholdInnerRadius)
      .outerRadius(thresholdOuterRadius)
      .padAngle(0);
    return arc;
  }

  get arcScale(): d3.ScaleLinear<number, number> {
    return this.d3.scaleLinear()
      .domain([this.options.minValue, this.options.maxValue])
      .range([(-1 * Math.PI) / 2 - CIRCLES_ROUNDING, Math.PI / 2 + CIRCLES_ROUNDING]);
  }

  protected _renderDraggableLines(): void {
    if(this.options.enableThresholdDrag === false) {
      return;
    }

    this._stopsValues.forEach((stopValue, stopIdx) => this._renderDraggableLine(stopValue, stopIdx));
    this._draggedThresholdValues = _.clone(this._stopsValues);
  }

  protected _renderDraggableLine(stopValue: number, idx: number): void {
    const arc = this._getThresholdArc();
    const draggableSize = 0.025;
    const thresholdAngle = this.arcScale(stopValue);

    const pie = d3.pie()
      .startAngle(thresholdAngle - draggableSize)
      .endAngle(thresholdAngle + draggableSize)
      .sort(null);

    const drag = this.d3.drag()
      .on('drag', () => this.onDrag(idx))
      .on('end', () => this.onDragEnd(idx));

    const dragLine = this.svg.selectAll(null)
      .data(pie([1]))
      .enter()
      .append('path')
      .attr('class', 'drag-line')
      .style('fill', 'black')
      .attr('d', arc as any)
      .attr('transform', this._gaugeTransform)
      .style('cursor', 'grab')
      .attr('pointer-events', 'all');
    dragLine.call(drag);
    this._draggableLines.push(dragLine);
  }

  onDrag(idx: number): void {
    const angle = this.getAngleFromCoordinates(this.d3.event.x, this.d3.event.y);
    const restrictedAngle = this.restrictAngle(angle, idx);
    this.updateDraggableLineByAngle(restrictedAngle, idx);
    const value = _.ceil(this.arcScale.invert(restrictedAngle), 1);
    this._draggedThresholdValues[idx] = value;
    this.updateThresholdArcByNewValues(this._draggedThresholdValues);
    this.updateThresholdLabel(value, idx);
    if(this.options.dragCallback) {
      this.options.dragCallback({ value, idx });
    }
  }

  updateThresholdArcByNewValues(stops: number[]): void {
    const thresholdArc = this._getThresholdArc();
    const stopArcs = this._d3Pie(this._getStopsRange(stops));
    this._thresholdArc
      .data(stopArcs)
      .attr('d', thresholdArc as any);
  }

  updateThresholdLabel(value: number, idx: number): void {
    if(_.isEmpty(this._thresholdTextLabels) || !this._thresholdTextLabels[idx]) {
      return;
    }
    this._thresholdTextLabels[idx].text(value);
  }

  updateDraggableLineByAngle(angle: number, idx: number): void {
    const arc = this._getThresholdArc();
    const draggableSize = 0.025;
    const pie = d3.pie()
      .startAngle(angle - draggableSize)
      .endAngle(angle + draggableSize)
      .sort(null);

    this._draggableLines[idx].data(pie([1])).attr('d', arc);
  }

  onDragEnd(idx: number): void {
    if(this.options.dragEndCallback) {
      this.options.dragEndCallback({ idx });
    }
  }

  getAngleFromCoordinates(x: number, y: number): number {
    const vector1 = { start: this._gaugeCenterCoordinate, end: { x: this._gaugeCenterCoordinate.x, y: 0 } };
    const vector2 = { start: this._gaugeCenterCoordinate, end: { x, y } };
    let a1 = this.getAngleBetween2Vectors(vector1, vector2);
    if(x < this.width / 2) { // angle < 0 degree
      return -a1;
    }
    return a1;
  }

  getAngleBetween2Vectors(
    vector1: { start: PointCoordinate, end: PointCoordinate },
    vector2: { start: PointCoordinate, end: PointCoordinate }
  ): number {
    const x1 = vector1.start.x; const y1 = vector1.start.y;
    const x2 = vector1.end.x; const y2 = vector1.end.y;
    const x3 = vector2.start.x; const y3 = vector2.start.y;
    const x4 = vector2.end.x; const y4 = vector2.end.y;
    return Math.acos(
      ((x2 - x1) * (x4 - x3) + (y2 - y1) * (y4 - y3)) /
      (Math.sqrt( (x2 - x1)**2 + (y2 - y1)**2 ) *
      Math.sqrt( (x4 - x3)**2 + (y4 - y3)**2 ))
    )
  }

  restrictAngle(angle: number, idx: number): number {
    return _.clamp(angle, -1.8, 1.8);
  }

  protected _renderLabels(): void {
    const yOffset = this._valueTextFontSize + 8;
    if(this.options.enableThresholdLabels) {
      if(this._stopsValues && this._stopsValues[0]) {
        this.renderLabelBackground(0, yOffset / 2);
        this._thresholdTextLabels.push(this.renderLabelText(this.width / 6, yOffset, String(this._stopsValues[0])));
      }
      if(this._stopsValues && this._stopsValues[1]) {
        this.renderLabelBackground(this.width * 2 / 3, yOffset / 2);
        this._thresholdTextLabels.push(this.renderLabelText(this.width * 5 / 6, yOffset, String(this._stopsValues[1])));
      }
    }
    if(this.options.enableExtremumLabels) {
      this.renderLabelBackground(0, this.height - yOffset);
      this.renderLabelText(this.width / 6, this.height - yOffset / 2, String(this._minValue));
      this.renderLabelBackground(this.width * 2 / 3, this.height - yOffset);
      this.renderLabelText(this.width * 5 / 6, this.height - yOffset / 2, String(this._maxValue));
    }
  }

  protected renderLabelBackground(x: number, y: number): void {
    this.svg
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', this.width / 3 + 'px')
      .attr('height', this._valueTextFontSize + 8 + 'px')
      .classed('label-background', true)
      .attr('rx', 16)
      .attr('fill', '#202330')
      .attr('pointer-events', 'none')
      .style('display', 'none')
      .attr('fill-opacity', 0.7);
  }

  protected renderLabelText(x: number, y: number, text: string): d3.Selection<SVGTextElement, unknown, null, undefined> {
    return this.svg
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .text(text)
      .classed('label-text', true)
      .attr('font-family', 'Roboto, "Helvetica Neue", Arial, sans-serif')
      .attr('font-size', `${this._valueTextFontSize}px`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('pointer-events', 'none')
      .style('display', 'none')
      .attr('fill', 'white');
  }

  private get _d3Pie(): d3.Pie<any, { valueOf(): number; }> {
    return d3.pie()
      .startAngle((-1 * Math.PI) / 2 - CIRCLES_ROUNDING)
      .endAngle(Math.PI / 2 + CIRCLES_ROUNDING)
      .sort(null);
  }

  private get _valueArcColors(): [string, string] {
    if(this.options.reversed === true) {
      return [this._valueArcBackgroundColor, this._mainCircleColor];
    }
    return [this._mainCircleColor, this._valueArcBackgroundColor];
  }

  private get _mainCircleColor(): string {
    if(this.aggregatedValue > _.max(this._stopsValues) || this._sortedStops.length === 0) {
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
  private _getStopsRange(stops: number[]): number[] {
    // TODO: refactor
    // TODO: max value might be less than the latest stop
    let stopValues = [...stops, this._maxValue];

    if(stopValues.length < 2) {
      return this.getUpdatedRangeWithMinValue(stopValues);
    }
    let range = [stopValues[0]];
    for(let i = 1; i < stopValues.length; i++) {
      range.push(stopValues[i] - stopValues[i-1]);
    }
    return this.getUpdatedRangeWithMinValue(range);
  }

  getUpdatedRangeWithMinValue(range: number[]): number[] {
    let updatedRange = range;
    updatedRange[0] = range[0] - this._minValue;
    if(this.options.reversed === true) {
      return _.reverse(updatedRange);
    }
    return updatedRange;
  }

  private get _valueRange(): [number, number] {
    const valueRange = this._maxValue - this._minValue;
    const startValue = this.aggregatedValue - this._minValue;
    const endValue = valueRange - startValue;
    if(this.options.reversed === true) {
      return [endValue, startValue];
    }
    return [startValue, endValue];
  }

  private get _sortedStops(): Stop[] {
    return _.sortBy(this.options.stops, [stop => stop.value]);
  }

  private get _stopsValues(): number[] {
    return this._sortedStops.map(stop => stop.value);
  }

  private get _colors(): string[] {
    // TODO: refactor
    const colors = [...this._sortedStops.map(stop => stop.color), this.options.defaultColor];
    if(this.options.reversed === true) {
      return _.reverse(colors);
    }
    return colors;
  }

  private get _valueText(): string {
    if(this.options.valueFormatter === undefined) {
      console.log('valueFormatter function is not specified, rendering raw value');
      return this.aggregatedValue.toString();
    }
    return this.options.valueFormatter(this.aggregatedValue);
  }

  private get _valueTextFontSize(): number {
    if(this.options.valueFontSize) {
      return this.options.valueFontSize;
    }
    let font;
    if(this._valueText.length <= 6) {
      font = DEFAULT_VALUE_TEXT_FONT_SIZE;
    } else if(this._valueText.length > 6 && this._valueText.length <= 10) {
      font = DEFAULT_VALUE_TEXT_FONT_SIZE - 2;
    } else if(this._valueText.length > 10 && this._valueText.length <= 12) {
      font = DEFAULT_VALUE_TEXT_FONT_SIZE - 4;
    } else {
      font = DEFAULT_VALUE_TEXT_FONT_SIZE - 6;
    }
    return this.rescaleValueFont(font);
  }

  private get _stat(): Stat {
    return this.options.stat;
  }

  private get _valueArcBackgroundColor(): string {
    return this.options.valueArcBackgroundColor;
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

  rescaleSpace(space: number): number {
    const scale = 0.5 * this._scaleFactor;
    return space * scale;
  }

  rescaleWith(width: number): number {
    const scale = 0.6 * this._scaleFactor;
    return width * scale;
  }

  private get _scaleFactor(): number {
    const stopOuterRadius = this.options.outerRadius + SPACE_BETWEEN_CIRCLES + STOPS_CIRCLE_WIDTH;
    const marginForRounded = VALUE_TEXT_MARGIN + 10;
    const scale = this._minWH / (stopOuterRadius + marginForRounded);
    return scale;
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

  private get _minValue(): number {
    return this.options.minValue || 0;
  }

  /* handlers and overloads */
  onMouseOver(): void {}
  onMouseMove(): void {}
  onMouseOut(): void {}

  onGaugeMouseOver(): void {
    this.svg.selectAll('.label-text').style('display', null);
    this.svg.selectAll('.label-background').style('display', null);
  }
  onGaugeMouseMove(): void {
    this.svg.selectAll('.label-text').style('display', null);
    this.svg.selectAll('.label-background').style('display', null);
  }
  onGaugeMouseOut(): void {
    this.svg.selectAll('.label-text').style('display', 'none');
    this.svg.selectAll('.label-background').style('display', 'none');
  }

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
      if(this.pod === undefined) { 
        this.pod = new ChartwerkGaugePod(document.getElementById(this.id), this.series, this.options);
        this.pod.render();
      } else {
        this.pod.updateData(this.series, this.options);
      }
    },
  }
};

export { GaugeOptions, GaugeTimeSerie, Stat };
