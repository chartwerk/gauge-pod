import { GaugeOptions } from './types';

import * as d3 from 'd3';

export type D3Node = d3.Selection<HTMLElement, unknown, null, undefined>;

export class Gauge {
  
  constructor(protected d3Node: D3Node, protected readonly options: GaugeOptions) {
    
  }

  public render() {
    this.d3Node.append('text').text('asdasd');
  }
}