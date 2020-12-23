import { GaugeTimeSerie, GaugeOptions, Stat } from './types';
import { ChartwerkPod } from '@chartwerk/base';
export declare class ChartwerkGaugePod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
    gaugeTransform: string;
    constructor(el: HTMLElement, _series?: GaugeTimeSerie[], _options?: GaugeOptions);
    get valueRange(): number[];
    get colors(): string[];
    get stat(): Stat;
    get stops(): number[];
    get innerRadius(): number;
    get outerRadius(): number;
    get aggregatedValue(): number;
    renderNeedle(): void;
    renderMetrics(): void;
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
