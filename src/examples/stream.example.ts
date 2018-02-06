import { Progress, ConsoleAdapter } from '../';

const StreamTest = require('streamtest');

StreamTest['v2'].fromObjects(' '.repeat(100).split(''), 100)
.pipe(Progress.create(process.stdout.columns! - 1))
.pipe(new ConsoleAdapter(1000))
.pipe(process.stdout);