import { GaugeTimeSerie, GaugeOptions } from './types';
import { ChartwerkPod } from '@chartwerk/core';
export declare class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
    private _gaugeTransform;
    constructor(el: HTMLElement, _series?: GaugeTimeSerie[], _options?: GaugeOptions);
    renderMetrics(): void;
    private get _valueRange();
    private get _colors();
    private get _stat();
    private get _innerRadius();
    private get _outerRadius();
    private get aggregatedValue();
    private get _maxValue();
    private _renderNeedle;
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
