import { Progress } from './ts-progress';
import { clearInterval } from 'timers';

const pb = new Progress();

let t = setInterval(() => {
  pb.update();
  if (pb.state.percentComplete >= 1.0) {
    clearInterval(t);
  }
}, 100);