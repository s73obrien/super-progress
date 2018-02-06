const { Progress } = require('../../dist');
const { EOL } = require('os');

const pb = Progress.create(process.stdout.columns - 1);

let t = setInterval(() => {
  pb.tick()
    .then(() => {
      if (pb.state.percentComplete >= 1.0) {
        clearInterval(t);
        process.stdout.write(EOL);
      }
    })
}, 100);
