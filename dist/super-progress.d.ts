/// <reference types="node" />
import { Writable, Transform } from 'stream';
export interface ProgressOptions {
    total?: number;
    pattern?: string;
    renderInterval?: number;
}
export interface ProgressState {
    startTime: number;
    elapsedTime: number;
    remainingTime: number;
    nextRender: number;
    percentComplete: number;
    rateTicks: number;
    currentTicks: number;
    totalTicks: number;
    ticksLeft: number;
}
export interface ProgressTokenDefinitions {
    [key: string]: {
        render: (state: ProgressState, spaceAllowedPerStar: number) => string;
        width: (state: ProgressState) => number;
    };
}
export declare class Progress extends Transform {
    width: number;
    options: ProgressOptions;
    tokens: ProgressTokenDefinitions;
    state: ProgressState;
    static create: (width: number, options?: ProgressOptions | undefined, tokens?: ProgressTokenDefinitions | undefined, state?: ProgressState | undefined) => Progress;
    static defaultProgressOptions: ProgressOptions;
    private constructor();
    _transform(data: string | Buffer, encoding: string, callback: Function): any | undefined;
    _flush(callback: Function): void;
    tick(ticks?: number, stream?: Writable): Promise<void>;
    display(rendered: string[], stream: Writable): Promise<void>;
    update(ticks?: number): Promise<void>;
    complete(): Promise<void>;
    render(): Promise<string[]>;
    private renderLine(line, available);
}
