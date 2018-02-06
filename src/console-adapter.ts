import { Transform } from "stream";
import { EOL } from "os";
const ansiEscapes = require('ansi-escapes');

export class ConsoleAdapter extends Transform {
  constructor(public interval: number = 33) {
    super({
      writableObjectMode: true
    });
  }

  private nextRender: number = 0;
  private lastRenderedDisplay: string;

  _transform(data: any,
    encoding: string,
    callback: Function): any | undefined {
    if (data) {

      if (Array.isArray(data)) {
        this.lastRenderedDisplay = data.join(EOL) + ansiEscapes.cursorUp(data.length - 1) + ansiEscapes.cursorLeft;
        let time = Date.now();
        if (time >= this.nextRender) {
          this.nextRender = time + this.interval;
          this.push(this.lastRenderedDisplay)
        } else {
          // this.push('');
        }
      }
    }
    callback();
  }

  _flush(callback: Function) {
    this.push(this.lastRenderedDisplay + EOL);
  }
}
