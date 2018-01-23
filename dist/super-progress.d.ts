/// <reference types="node" />
import { Writable } from 'stream';
export declare class ProgressOptions {
    total?: number;
    pattern?: string;
    renderInterval?: number;
}
export interface ProgressState {
    startTime: number;
    elapsedTime: number;
    remainingTime: number;
    percentComplete: number;
    rateTicks: number;
    currentTicks: number;
    totalTicks: number;
    ticksLeft: number;
    nextRender: number;
}
export interface ProgressTokenDefinitions {
    [key: string]: {
        render: (state: ProgressState, spaceAllowedPerStar: number) => string;
        width: (state: ProgressState) => number;
    };
}
export declare class Progress {
    options: ProgressOptions;
    tokens: ProgressTokenDefinitions;
    state: ProgressState;
    static create: (options?: ProgressOptions | undefined, tokens?: ProgressTokenDefinitions | undefined, state?: ProgressState | undefined) => Progress;
    static defaultProgressOptions: ProgressOptions;
    private constructor();
    display(rendered: string[], stream: Writable): Promise<void>;
    update(ticks?: number): Promise<void>;
    render(width: number): Promise<string[]>;
    private renderLine(line, available);
}
