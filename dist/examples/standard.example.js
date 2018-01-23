"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var super_progress_1 = require("../super-progress");
var timers_1 = require("timers");
var os_1 = require("os");
var pb = super_progress_1.Progress.create();
var isNode = require('detect-node');
var cursor = require('cli-cursor');
if (isNode) {
    cursor.hide(process.stdout);
    var t_1 = setInterval(function () {
        pb.update()
            .then(function () { return pb.render(process.stdout.columns); })
            .then(function (r) { return pb.display(r, process.stdout); })
            .then(function () {
            if (pb.state.percentComplete >= 1.0) {
                process.stdout.write(os_1.EOL);
                timers_1.clearInterval(t_1);
                cursor.show(process.stdout);
            }
        });
    }, 100);
}
else {
    console.error('This example must be run within a NodeJS environment.');
}
//# sourceMappingURL=standard.example.js.map