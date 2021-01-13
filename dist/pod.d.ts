import { GaugeOptions, GaugeTimeSerie } from './types';
import { ChartwerkPod } from '@chartwerk/core';
export declare class Pod extends ChartwerkPod<GaugeTimeSerie, GaugeOptions> {
    protected readonly options: GaugeOptions;
    constructor(el: HTMLElement, series: GaugeTimeSerie[], options: GaugeOptions);
    renderMetrics(): void;
    onMouseOver(): void;
    onMouseMove(): void;
    onMouseOut(): void;
    renderSharedCrosshair(): void;
    hideSharedCrosshair(): void;
}
