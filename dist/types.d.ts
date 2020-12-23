import { TimeSerie, Options } from '@chartwerk/base';
export declare enum Stat {
    CURRENT = "current",
    MIN = "min",
    MAX = "max",
    TOTAL = "total"
}
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
};
export declare type GaugeOptions = Options & Partial<GaugeOptionsParams>;
