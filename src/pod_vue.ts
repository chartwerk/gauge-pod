import { VueChartwerkPodMixin } from '@chartwerk/core';
import { GaugeChartwerkPod } from './gauge_pod'


// it is used with Vue.component, e.g.: Vue.component('chartwerk-gauge-pod', VueChartwerkGaugePodObject)
export const ChartwerkGaugePodVue = {
  // alternative to `template: '<div class="chartwerk-gauge-pod" :id="id" />'`
  render(createElement) {
    console.log('render in VuePod.render')
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
      // TODO: set options properly
      // TODO: make update insted of full rerendering
      this.pod = new GaugeChartwerkPod(
        document.getElementById(this.id), this.series, this.options
      );
      this.pod.render();
      
    },
  }
};
