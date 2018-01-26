import { defaultTokenDefinitions } from './default-tokens';
import { Writable } from 'stream';
import { moveCursor, cursorTo } from 'readline';
import { EOL } from 'os';

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
  }
}

export class Progress {
  public static create = (
    options?: ProgressOptions,
    tokens?: ProgressTokenDefinitions,
    state?: ProgressState): Progress => {

    let o: ProgressOptions = { ...Progress.defaultProgressOptions, ...options }
    o.pattern = o.pattern!;
    o.total = o.total!;
    o.renderInterval = o.renderInterval!;

    let t: ProgressTokenDefinitions = { ...defaultTokenDefinitions, ...tokens }
    let s: ProgressState = {
      elapsedTime: 0,
      remainingTime: 0,
      percentComplete: 0,
      currentTicks: 0,
      rateTicks: 0,
      nextRender: 0,
      startTime: Date.now(),
      totalTicks: 100,
      ticksLeft: 100,
      ...state
    };

    if (o.total) {
      s.totalTicks = o.total;
      s.ticksLeft = o.total;
    }

    return new Progress(o, t, s);
  }

  public static defaultProgressOptions: ProgressOptions = {
    total: 100,
    pattern: `[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`,
    renderInterval: 33
  }

  private constructor(
    public options: ProgressOptions,
    public tokens: ProgressTokenDefinitions,
    public state: ProgressState) { }

  public async display(rendered: string[], stream: Writable): Promise<void> {

    let time = Date.now();
    if (time >= this.state.nextRender) {
      this.state.nextRender = time + this.options.renderInterval!;

      stream.write(rendered.join(EOL));
      moveCursor(stream, 0, -1 * (rendered.length - 1));
      cursorTo(stream, 0);
    }
  }

  public async update(ticks: number = 1): Promise<void> {
    this.state.currentTicks += ticks;                                               // ticks
    this.state.percentComplete = this.state.currentTicks / this.state.totalTicks;   // raw decimal
    this.state.elapsedTime = Date.now() - this.state.startTime;                     // ms
    this.state.ticksLeft = this.state.totalTicks - this.state.currentTicks;         // ticks
    this.state.rateTicks = this.state.currentTicks / this.state.elapsedTime;        // ticks/ms
    this.state.remainingTime = this.state.currentTicks / this.state.rateTicks;      // ms
  }

  public async render(
    width: number
  ): Promise<string[]> {
    let lines: string[] = this.options.pattern!.split(/\r\n|\r|\n/g);
    return Promise.all(lines.map(s => this.renderLine(s, width)));
  }

  private async renderLine(line: string, available: number): Promise<string> {
    let spaceTaken: number = 0;
    let stars: number = 0;
    let leftovers: string = line;

    // loop through each token and acquire the length for each
    // if the token returns a -1 instead of a width, then
    // we will tell it how much space it has on the next pass
    for (let token in this.tokens) {
      leftovers = leftovers.replace(new RegExp(`{${token}}`, 'g'), '');
      let matches = line.match(new RegExp(`\{${token}\}`, 'g'));
      if (matches !== null) {
        let width: number = this.tokens[token].width(this.state);
        if (width === -1) {
          stars += matches.length;
        } else {
          spaceTaken += (matches.length * width);
        }
      }
    }

    const spaceAvailable = Math.max(0, available - leftovers.length - spaceTaken - 1);

    let spacePerStar = 0;
    if (stars > 0) {
      spacePerStar = Math.floor(spaceAvailable / stars);
    }

    let rendered: string = line;
    for (let token in this.tokens) {
      rendered = rendered.replace(new RegExp(`{${token}}`, 'g'), this.tokens[token].render(this.state, spacePerStar));
    }

    return rendered;
  }
}
