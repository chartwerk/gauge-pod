import { ChartwerkBase, VueChartwerkBaseMixin, TickOrientation, TimeFormat, AxisFormat } from '@chartwerk/base';

import * as d3 from 'd3';




export class ChartwerkGaugePod extends ChartwerkBase<any, any> {

  // TODO: define the type better
  private _dValue: d3.Selection<SVGTextElement, unknown, null, undefined>;

  constructor(el: HTMLElement, _series: any[] = [], _options: any = {}) {
    super(d3, el, _series, _options);
    this._init();
  }


  private _init() {
    this._initValueText();
  }

  private _initValueText(): void {
    this._dValue = this._chartContainer
      .append('text')
      .text('hey you')
      .attr('fill', 'black');
  }


  _renderMetrics(): void {
    
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
  mixins: [VueChartwerkBaseMixin],
  methods: {
    render() {
      const pod = new ChartwerkGaugePod(document.getElementById(this.id), this.series, this.options);
      pod.render();
    }
  }
};

