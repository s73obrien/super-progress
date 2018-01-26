const progress = require('../../dist').Progress;
const os = require('os');

const pb = progress.create();

let t = setInterval(() => {
  pb.update()
    .then(() => pb.render(process.stdout.columns))
    .then(r => pb.display(r, process.stdout))
    .then(() => {
      if (pb.state.percentComplete >= 1.0) {
        clearInterval(t);
        process.stdout.write(os.EOL);
      }
    })
}, 100);