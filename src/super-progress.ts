
import { Stream } from 'stream';
import charm = require('charm');

import { CharmAnyStream, CharmInstance } from 'charm';
import { WriteStream } from 'tty';
import { defaultTokenDefinitions } from './default-tokens';
import { EOL } from 'os';

export interface ProgressOptions {
  total: number,
  pattern?: string,
  textColor?: string,
  title?: string,
  updateInterval?: number
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

  nextUpdate: number;
}

export interface ProgressTokenDefinition {
  token: string;
  render: (state: ProgressState, spaceAllowedPerStar: number) => string;
  width: (state: ProgressState) => number;
}

export class Progress {
  private STATE_BUFFER_SIZE: number = 300;

  charmOut: CharmInstance;

  constructor(
    public options: ProgressOptions = {
      total: 100,
      pattern: `Progress: {bar} | {indeterminate} | {status} | {spinner} | Elapsed: {elapsed} | {percent}`,
      updateInterval: 33 // 1/30th of a second between frames
    },
    public tokens: ProgressTokenDefinition[] = [],
    private streamOut: NodeJS.WriteStream = process.stdout,
    public state: ProgressState = {
      startTime: Date.now(),
      elapsedTime: 0,
      remainingTime: 0,
      percentComplete: 0,
      currentTicks: 0,
      rateTicks: 0,
      totalTicks: options.total,
      ticksLeft: options.total,
      nextUpdate: 0
    }) {
    this.tokens = this.tokens.concat(defaultTokenDefinitions);

    this.charmOut = charm(streamOut);
  }

  public update(ticks: number = 1) {
    this.state.currentTicks += ticks;                                               // ticks
    this.state.percentComplete = this.state.currentTicks / this.state.totalTicks;   // raw decimal
    this.state.elapsedTime = Date.now() - this.state.startTime;                     // ms
    this.state.ticksLeft = this.state.totalTicks - this.state.currentTicks;         // ticks
    this.state.rateTicks = this.state.currentTicks / this.state.elapsedTime;        // ticks/ms
    this.state.remainingTime = this.state.currentTicks / this.state.rateTicks;      // ms

    this.render();

  }

  private render() {
    let time = Date.now();
    if (time >= this.state.nextUpdate) {
      this.state.nextUpdate = time + this.options.updateInterval;
      let lines: string[] = this.options.pattern.split(/\r\n|\r|\n/g);
      let rendered: string = lines.map(s => this.renderLine(s)).join(EOL);

      // Move to start of top line and erase everything below it
      this.charmOut.up(lines.length).erase('down').write("\r");
      this.charmOut.write(rendered);
      this.charmOut.write(EOL);
    }
  }

  private renderLine(line: string): string {
    let spaceTaken: number = 0;
    let stars: number = 0;
    let leftovers: string = line;

    // loop through each token and acquire the length for each
    // if the token returns a -1 instead of a width, then
    // we will tell it how much space it has on the next pass
    for (let token of this.tokens) {
      leftovers = leftovers.replace(`{${token.token}}`, '');
      let matches = line.match(new RegExp(`\{${token.token}\}`, 'g'));
      if (matches !== null) {
        let width: number = token.width(this.state);
        if (width === -1) {
          stars += matches.length;
        } else {
          spaceTaken += (matches.length * width);
        }
      }
    }

    const spaceAvailable = Math.max(0, this.streamOut.columns - leftovers.length - spaceTaken - 1);
    const spacePerStar = Math.floor(spaceAvailable / stars);

    let rendered: string = line;
    for (let token of this.tokens) {
      rendered = rendered.replace(new RegExp(`{${token.token}}`, 'g'), token.render(this.state, spacePerStar));
    }

    return rendered;
  }
}
