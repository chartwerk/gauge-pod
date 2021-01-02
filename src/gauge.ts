import { GaugeOptions } from './types';

import * as d3 from 'd3';

export type D3SVGSelection = d3.Selection<SVGElement, unknown, null, undefined>;

export type BoundingBox = {
  x?: number, y?: number,
  width: number, height:number
}

export class Gauge {
  private _rootGroup: D3SVGSelection;

  private _boundingBox: BoundingBox;
  private _radius: number;
  private _centrum: { x: number, y: number };

  constructor(
    protected svg: D3SVGSelection,
    protected readonly options: GaugeOptions
  ) {}

  private _setBoundingBox(boundingBox: BoundingBox) {
    this._boundingBox = boundingBox;
    if(this._boundingBox.x === undefined) {
      this._boundingBox.x = 0;
    }
    if(this._boundingBox.y === undefined) {
      this._boundingBox.y = 0;
    }
    let minWH = Math.min(this._boundingBox.width, this._boundingBox.height);
    this._radius = minWH / 2;
    this._centrum = {
      x: this._boundingBox.width / 2,
      y: this._boundingBox.height / 2,
    };
  }

  public render(value: number, boudingBox: BoundingBox) {
    this._setBoundingBox(boudingBox);
    this._initRootGroup();
    this._renderValueArc();
  }

  private _initRootGroup() {
    this._rootGroup = this.svg.append('g');
    this._rootGroup.attr(
      'transform', `translate(${this._boundingBox.x} ${this._boundingBox.y})`
    );
  }

  private _renderValueArc() {
    this._rootGroup
      .append('circle')
      .attr('cx', this._centrum.x)
      .attr('cy', this._centrum.y)
      .attr('r',  this._radius)
  }
}
