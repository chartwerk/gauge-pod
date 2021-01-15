import { GaugeTimeSerie, GaugeOptions, Stat } from './types';
import { ChartwerkPod } from '@chartwerk/core';
export declare class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
    lastHeight: number;
    lastWidth: number;
    constructor(el: HTMLElement, _series?: GaugeTimeSerie[], _options?: GaugeOptions);
    renderMetrics(): void;
    _waitForLoadAndRender(): void;
    get _gaugeTransform(): string;
    get _gaugeCenter(): string;
    get _minWH(): number;
    private _renderValue;
    private _renderValueArc;
    private _renderThresholdArc;
    private get _d3Pie();
    private get _valueArcColors();
    private get _mainCircleColor();
    private get _stopsRange();
    private get _valueRange();
    private get _sortedStops();
    private get _stopsValues();
    private get _colors();
    private get _valueText();
    private get _valueTextFontSize();
    private get _stat();
    private get _innerRadius();
    private get _outerRadius();
    rescaleArcRadius(radius: number): number;
    rescaleValueFont(fontsize: number): number;
    private get _scaleFactor();
    private get _valueTextDecimals();
    private get aggregatedValue();
    private get _maxValue();
    onMouseOver(): void;
    onMouseMove(): void;
    onMouseOut(): void;
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
        methods: {
            render(): void;
            renderChart(): void;
            appendEvents(): void;
            zoomIn(range: any): void;
            zoomOut(center: any): void;
            mouseMove(evt: any): void;
            mouseOut(): void;
            onLegendClick(idx: any): void;
            panningEnd(range: any): void;
            contextMenu(evt: any): void;
        };
    }[];
    methods: {
        render(): void;
    };
};
export { GaugeOptions, GaugeTimeSerie, Stat };
