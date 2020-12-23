import { ChartwerkPod, VueChartwerkPodMixin } from '@chartwerk/base';

import * as d3 from 'd3';




export class ChartwerkGaugePod extends ChartwerkPod<any, any> {
  gaugeCenter = '';

  // it will be options
  colors = ['green', 'yellow', 'red'];
  stops = [10, 30];
  value = 40;

  constructor(el: HTMLElement, _series: any[] = [], _options: any = {}) {
    super(d3, el, _series, _options);
  }

  get valueRange(): number[] {
    if(this.stops.length < 2) {
      return this.stops;
    }
    let range = [this.stops[0]];
    for(let i = 1; i < this.stops.length; i++) {
      range.push(this.stops[i]-this.stops[i-1]);
    }
    return range;
  }

  renderLine(): void {
    let scale = d3.scaleLinear().domain([0, this.maxValue]).range([0, 180]);
    this.chartContainer.selectAll('.needle').data([this.value])
      .transition()
      .ease(d3.easeElasticOut)
      .duration(1000)
      .attr('transform', (d: number) => {
        return this.gaugeCenter + 'rotate(' + scale(d) + ')'
      });
  }

  renderMetrics(): void {
    this.gaugeCenter = `translate(${this.width / 2},${this.height - 10})`;

    let arc = d3.arc()
      .innerRadius(50)
      .outerRadius(80)
      .padAngle(0);

    let pie = d3.pie()
      .startAngle((-1 * Math.PI) / 2)
      .endAngle(Math.PI / 2)

    let arcs = pie(this.valueRange);
    let background = this.chartContainer.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .style('fill', (d: object, i: number) => {
        return this.colors[i];
      })
      .attr('d', arc as any)
      .attr('transform', this.gaugeCenter)

    let needle = this.chartContainer.selectAll('.needle')
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
        return this.gaugeCenter + 'rotate(' + d + ')'
      });

    this.renderLine();
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

