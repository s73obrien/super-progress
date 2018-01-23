"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
exports.defaultTokenDefinitions = {
    // the bar token displays a bar showing how much of a process has
    // completed.  It takes up as much space as the layout engine will
    // allow.  This is specified by returning -1 in the width function.
    bar: {
        render: function (state, allowed) {
            var percent = state.percentComplete;
            if (percent > 1.00) {
                percent = 1;
            }
            var complete = Math.floor(allowed * percent);
            return chalk_1.default.bgBlueBright(' '.repeat(complete)) + chalk_1.default.bgBlackBright(' '.repeat(allowed - complete));
        },
        width: function () { return -1; }
    },
    // the elapsed token displays the amount time that has elapsed since
    // the beginning of the process.  It is displayed in hh:mm:ss.sss format.
    // Since we know the exact width of the desired output, we return it
    // in the width function.
    elapsed: {
        render: function (state, allowed) {
            var seconds = (state.elapsedTime / 1000) % 60;
            var minutes = Math.floor((state.elapsedTime / 1000 / 60) % 60);
            var hours = Math.floor((state.elapsedTime / 1000 / 60 / 60));
            return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toFixed(3).padStart(6, '0');
        },
        width: function () { return 12; }
    },
    // the percent token displays the amount of the process that has been
    // completed as a percentage.  It shows 2 decimal places of precision.
    percent: {
        render: function (state, allowed) {
            return (state.percentComplete * 100).toFixed(2) + '%';
        },
        width: function () { return 7; }
    },
    // The spinner token simply displays an ascii 'wheel' that constantly
    // spins as the process is occurring.
    spinner: {
        render: function (state, allowed) {
            var frames = [
                '-',
                '\\',
                '|',
                '/'
            ];
            return frames[state.currentTicks % frames.length];
        },
        width: function () { return 1; }
    }
};
//# sourceMappingURL=default-tokens.js.map