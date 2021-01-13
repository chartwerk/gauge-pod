import { GaugeOptions } from './types';
import * as d3 from 'd3';
export declare type D3SVGSelection = d3.Selection<SVGElement, unknown, null, undefined>;
export declare type BoundingBox = {
    x?: number;
    y?: number;
    width: number;
    height: number;
};
export declare class Gauge {
    protected svg: D3SVGSelection;
    protected readonly options: GaugeOptions;
    private _rootGroup;
    private _boundingBox;
    private _radius;
    private _centrum;
    constructor(svg: D3SVGSelection, options: GaugeOptions);
    private _setBoundingBox;
    render(value: number, boudingBox: BoundingBox): void;
    private _initRootGroup;
    private _renderValueArc;
}
