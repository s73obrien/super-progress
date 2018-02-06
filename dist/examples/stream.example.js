"use strict";
exports.__esModule = true;
var _1 = require("../");
var StreamTest = require('streamtest');
StreamTest['v2'].fromObjects(' '.repeat(100).split(''), 100)
    .pipe(_1.Progress.create(process.stdout.columns - 1))
    .pipe(new _1.ConsoleAdapter(1000))
    .pipe(process.stdout);
//# sourceMappingURL=stream.example.js.map