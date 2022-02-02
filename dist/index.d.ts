import { GaugeTimeSerie, GaugeOptions, Stat, PointCoordinate } from './types';
import { ChartwerkPod } from '@chartwerk/core';
import * as d3 from 'd3';
export declare class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
    _draggableLines: any[];
    _draggedThresholdValues: number[];
    _thresholdArc: any | null;
    _thresholdTextLabels: any[];
    constructor(el: HTMLElement, _series?: GaugeTimeSerie[], _options?: GaugeOptions);
    renderMetrics(): void;
    protected updateOptions(newOptions: GaugeOptions): void;
    get _gaugeTransform(): string;
    get _gaugeCenterTranform(): string;
    get _gaugeCenterCoordinate(): {
        x: number;
        y: number;
    };
    get _minWH(): number;
    private _renderIcons;
    private _renderIcon;
    private _getIconPosition;
    private _getIconSize;
    protected _renderOverlayBackground(): void;
    private _renderValue;
    private _renderValueArc;
    private _renderThresholdArc;
    protected _getThresholdArc(): d3.Arc<any, d3.DefaultArcObject>;
    get arcScale(): d3.ScaleLinear<number, number>;
    protected _renderDraggableLines(): void;
    protected _renderDraggableLine(stopValue: number, idx: number): void;
    onDrag(idx: number): void;
    updateThresholdArcByNewValues(stops: number[]): void;
    updateThresholdLabel(value: number, idx: number): void;
    updateDraggableLineByAngle(angle: number, idx: number): void;
    onDragEnd(idx: number): void;
    getAngleFromCoordinates(x: number, y: number): number;
    getAngleBetween2Vectors(vector1: {
        start: PointCoordinate;
        end: PointCoordinate;
    }, vector2: {
        start: PointCoordinate;
        end: PointCoordinate;
    }): number;
    restrictAngle(angle: number, idx: number): number;
    protected _renderLabels(): void;
    protected renderLabelBackground(x: number, y: number): void;
    protected renderLabelText(x: number, y: number, text: string): d3.Selection<SVGTextElement, unknown, null, undefined>;
    private get _d3Pie();
    private get _valueArcColors();
    private get _mainCircleColor();
    private _getStopsRange;
    getUpdatedRangeWithMinValue(range: number[]): number[];
    private get _valueRange();
    private get _sortedStops();
    private get _stopsValues();
    private get _colors();
    private get _valueText();
    private get _valueTextFontSize();
    private get _stat();
    private get _valueArcBackgroundColor();
    private get _innerRadius();
    private get _outerRadius();
    rescaleArcRadius(radius: number): number;
    rescaleValueFont(fontsize: number): number;
    rescaleSpace(space: number): number;
    rescaleWith(width: number): number;
    private get _scaleFactor();
    private get aggregatedValue();
    private get _maxValue();
    private get _minValue();
    onMouseOver(): void;
    onMouseMove(): void;
    onMouseOut(): void;
    onGaugeMouseOver(): void;
    onGaugeMouseMove(): void;
    onGaugeMouseOut(): void;
    renderSharedCrosshair(): void;
    hideSharedCrosshair(): void;
}
export declare const VueChartwerkGaugePodObject: {
    render(createElement: any): any;
    mixins: {
        props: {
            id: {
                type: StringConstructor;
                required: boolean;
            };
            series: {
                type: ArrayConstructor;
                required: boolean;
                default: () => any[];
            };
            options: {
                type: ObjectConstructor;
                required: boolean;
                default: () => {};
            };
        };
        watch: {
            id(): void;
            series(): void;
            options(): void;
        };
        mounted(): void;
        destroyed(): void;
        methods: {
            render(): void;
            renderSharedCrosshair(values: {
                x?: number;
                y?: number;
            }): void;
            hideSharedCrosshair(): void;
            onPanningRescale(event: any): void;
            renderChart(): void;
            appendEvents(): void;
            zoomIn(range: any): void;
            zoomOut(centers: any): void;
            mouseMove(evt: any): void;
            mouseOut(): void;
            onLegendClick(idx: any): void;
            panningEnd(range: any): void;
            panning(range: any): void;
            contextMenu(evt: any): void;
            sharedCrosshairMove(event: any): void;
        };
    }[];
    methods: {
        render(): void;
    };
};
export { GaugeOptions, GaugeTimeSerie, Stat };
