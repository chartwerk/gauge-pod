import { ChartwerkBase, VueChartwerkBaseMixin, TickOrientation, TimeFormat, AxisFormat } from '@chartwerk/base';

import * as d3 from 'd3';
import * as _ from 'lodash';


export class ChartwerkGaugePod extends ChartwerkBase<any, any> {
  _metricsContainer: any;

  constructor(el: HTMLElement, _series: any[] = [], _options: any = {}) {
    super(d3, el, _series, _options);
  }

  _renderMetrics(): void {
  }


  onMouseOver(): void {
    // TODO: add
  }

  onMouseMove(): void {
    // TODO: add
  }

  onMouseOut(): void {
    // TODO: add
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
  mixins: [VueChartwerkBaseMixin],
  methods: {
    render() {
      const pod = new ChartwerkGaugePod(document.getElementById(this.id), this.series, this.options);
      pod.render();
    }
  }
};

