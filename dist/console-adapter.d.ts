/// <reference types="node" />
import { Transform } from "stream";
export declare class ConsoleAdapter extends Transform {
    interval: number;
    constructor(interval?: number);
    private nextRender;
    private lastRenderedDisplay;
    _transform(data: any, encoding: string, callback: Function): any | undefined;
    _flush(callback: Function): void;
}
