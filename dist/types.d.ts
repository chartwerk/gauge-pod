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
export declare type GaugeOptionsParams = {
    innerRadius: number;
    outerRadius: number;
    maxValue: number;
    stops: {
        color: string;
        value: number;
    }[];
    defaultColor: string;
    stat: Stat;
    valueFormatter: ValueFormatter;
};
export declare type GaugeOptions = Options & Partial<GaugeOptionsParams>;
