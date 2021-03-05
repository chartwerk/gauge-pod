import { TimeSerie, Options } from '@chartwerk/core';
export declare enum Stat {
    CURRENT = "current",
    MIN = "min",
    MAX = "max",
    TOTAL = "total"
}
export declare type Stop = {
    color: string;
    value: number | null;
};
export declare type ValueFormatter = (value: number) => string;
export declare type GaugeTimeSerie = TimeSerie;
export declare type IconConfig = {
    src: string;
    position: IconPosition;
    size: number;
};
export declare enum IconPosition {
    LEFT = "left",
    MIDDLE = "middle",
    RIGHT = "right"
}
export declare type GaugeOptionsParams = {
    innerRadius: number;
    outerRadius: number;
    maxValue: number;
    minValue: number;
    stops: {
        color: string;
        value: number;
    }[];
    defaultColor: string;
    stat: Stat;
    valueFormatter: ValueFormatter;
    icons: IconConfig[];
    valueFontSize: number;
    valueArcBackgroundColor: string;
};
export declare type GaugeOptions = Options & Partial<GaugeOptionsParams>;
