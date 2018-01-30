import { Progress } from '../super-progress';
import { clearInterval } from 'timers';
import { EOL } from 'os';

const cursor = require('cli-cursor');

// Examples
import { example as standard } from './standard.example';
import { example as pattern } from './pattern.example';

runExamples().then(() => {
  console.log(EOL);
})

async function runExamples() {
  if (require('detect-node')) {
    cursor.hide(process.stdout);
    process.stdout.write('Standard Progress Bar' + EOL);
    await runExample(standard());
    process.stdout.write('Example of pattern option' + EOL);
    await runExample(pattern());
    console.log("DONE")
    cursor.show(process.stdout);
  } else {
    console.error('This example must be run within a NodeJS environment.');
  }
}

function runExample(pb: Progress): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let t = setInterval(() => {
      pb.update()
      .then(() => pb.render(process.stdout.columns! - 1))
      .then(r => pb.display(r, process.stdout))
      .then(() => {
        if (pb.state.percentComplete >= 1.0) {
          process.stdout.write(EOL);
          clearInterval(t);
          resolve();
        }
      })
    }, 100);
  });
}
