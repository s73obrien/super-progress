"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var timers_1 = require("timers");
var os_1 = require("os");
var cursor = require('cli-cursor');
// Examples
var standard_example_1 = require("./standard.example");
var pattern_example_1 = require("./pattern.example");
runExamples().then(function () {
    console.log(os_1.EOL);
});
function runExamples() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!require('detect-node')) return [3 /*break*/, 3];
                    cursor.hide(process.stdout);
                    process.stdout.write('Standard Progress Bar' + os_1.EOL);
                    return [4 /*yield*/, runExample(standard_example_1.example())];
                case 1:
                    _a.sent();
                    process.stdout.write('Example of pattern option' + os_1.EOL);
                    return [4 /*yield*/, runExample(pattern_example_1.example())];
                case 2:
                    _a.sent();
                    console.log("DONE");
                    cursor.show(process.stdout);
                    return [3 /*break*/, 4];
                case 3:
                    console.error('This example must be run within a NodeJS environment.');
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function runExample(pb) {
    return new Promise(function (resolve, reject) {
        var t = setInterval(function () {
            pb.update()
                .then(function () { return pb.render(process.stdout.columns - 1); })
                .then(function (r) { return pb.display(r, process.stdout); })
                .then(function () {
                if (pb.state.percentComplete >= 1.0) {
                    process.stdout.write(os_1.EOL);
                    timers_1.clearInterval(t);
                    resolve();
                }
            });
        }, 100);
    });
}
//# sourceMappingURL=examples.js.map