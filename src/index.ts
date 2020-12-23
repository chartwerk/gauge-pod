import { GaugeTimeSerie, GaugeOptions, Stat } from './types';

import { ChartwerkPod, VueChartwerkPodMixin, ZoomType } from '@chartwerk/base';

import * as d3 from 'd3';

import * as _ from 'lodash';


const DEFAULT_GAUGE_OPTIONS: GaugeOptions = {
  usePanning: false,
  renderLegend: false,
  renderYaxis: false,
  renderXaxis: false,
  renderGrid: false,
  zoom: {
    type: ZoomType.NONE
  },

  colors: ['green', 'yellow', 'red'],
  stops: [10, 30, 50],
  stat: Stat.CURRENT,
  innerRadius: 50,
  outerRadius: 80
};

export class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
  gaugeTransform = '';

  constructor(el: HTMLElement, _series: GaugeTimeSerie[] = [], _options: GaugeOptions = {}) {
    super(
      d3, el, _series,
      _.defaults(_options, DEFAULT_GAUGE_OPTIONS)
    );
  }

  get valueRange(): number[] {
    if(this.stops.length < 2) {
      return this.stops;
    }
    let range = [this.stops[0]];
    for(let i = 1; i < this.stops.length; i++) {
      range.push(this.stops[i] - this.stops[i-1]);
    }
    return range;
  }

  get colors(): string[] {
    return this.options.colors;
  }

  get stat(): Stat {
    return this.options.stat;
  }

  get stops(): number[] {
    return this.options.stops;
  }

  get innerRadius(): number {
    return this.options.innerRadius;
  }

  get outerRadius(): number {
    return this.options.outerRadius;
  }

  get aggregatedValue(): number {
    switch(this.stat) {
      case Stat.CURRENT:
        return _.last(this.series[0].datapoints)[0];
      default:
        throw new Error(`Unsupported stat: ${this.stat}`);
    }
  }

  renderNeedle(): void {
    const maxValue = this.options.maxValue || this.maxValue;

    let scale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, 180])
      .clamp(true);

    this.chartContainer.selectAll('.needle').data([this.aggregatedValue])
      .transition()
      .ease(d3.easeElasticOut)
      .duration(1000)
      .attr('transform', (d: number) => {
        return this.gaugeTransform + 'rotate(' + scale(d) + ')'
      });
  }

  renderMetrics(): void {
    if(this.series.length === 0 || this.series[0].datapoints.length === 0) {
      this.renderNoDataPointsMessage();
      return;
    }

    this.gaugeTransform = `translate(${this.width / 2},${this.height - 10})`;

    const arc = d3.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .padAngle(0);

    const pie = d3.pie()
      .startAngle((-1 * Math.PI) / 2)
      .endAngle(Math.PI / 2)
      .sort(null);

    const arcs = pie(this.valueRange);

    this.chartContainer.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .style('fill', (d: object, i: number) => {
        return this.colors[i];
      })
      .attr('d', arc as any)
      .attr('transform', this.gaugeTransform)

    const needle = this.chartContainer.selectAll('.needle')
      .data([0])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', -80)
      .attr('y1', 0)
      .attr('y2', 0)
      .classed('needle', true)
      .style('stroke', 'black')
      .attr('transform', (d: number) => {
        return this.gaugeTransform + 'rotate(' + d + ')'
      });

    this.renderNeedle();
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

