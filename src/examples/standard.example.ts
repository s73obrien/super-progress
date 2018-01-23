import { Progress } from '../super-progress';
import { clearInterval } from 'timers';
import { EOL } from 'os';

const pb = Progress.create();

const isNode = require('detect-node');
const cursor = require('cli-cursor');

if (isNode) {
  cursor.hide(process.stdout);
  let t = setInterval(() => {
    pb.update()
      .then(() => pb.render(process.stdout.columns!))
      .then(r => pb.display(r, process.stdout))
      .then(() => {
        if (pb.state.percentComplete >= 1.0) {
          process.stdout.write(EOL);
          clearInterval(t);
          cursor.show(process.stdout);
        }
      })
  }, 100);
} else {
  console.error('This example must be run within a NodeJS environment.');
}