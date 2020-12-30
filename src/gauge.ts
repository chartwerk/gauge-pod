import { GaugeOptions } from './types';

import * as d3 from 'd3';

export type SVGD3 = d3.Selection<SVGElement, unknown, null, undefined>;

export type BoundingBox = {
  x?: number, y?: number,
  width: number, height:number
}

export class Gauge {
  
  private _root: d3.Selection<SVGElement, unknown, null, undefined>;
  constructor(
    protected svg: SVGD3,
    protected readonly options: GaugeOptions
  ) {}

  public render(value: number, boudingBox: BoundingBox) {
    let rootGroup = this.svg.append('g');
    if(boudingBox.x === undefined) {
      boudingBox.x = 0;
    }
    if(boudingBox.y === undefined) {
      boudingBox.y = 0;
    }
    rootGroup.attr('transform', `translate(${boudingBox.x} ${boudingBox.y})`);
    rootGroup.append('rect')
      .attr('width', boudingBox.width)
      .attr('height', boudingBox.height)
      .attr('style', 'fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)')
  }
}