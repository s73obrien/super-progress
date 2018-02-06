"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var stream_1 = require("stream");
var os_1 = require("os");
var ansiEscapes = require('ansi-escapes');
var ConsoleAdapter = /** @class */ (function (_super) {
    __extends(ConsoleAdapter, _super);
    function ConsoleAdapter(interval) {
        if (interval === void 0) { interval = 33; }
        var _this = _super.call(this, {
            writableObjectMode: true
        }) || this;
        _this.interval = interval;
        _this.nextRender = 0;
        return _this;
    }
    ConsoleAdapter.prototype._transform = function (data, encoding, callback) {
        if (data) {
            if (Array.isArray(data)) {
                this.lastRenderedDisplay = data.join(os_1.EOL) + ansiEscapes.cursorUp(data.length - 1) + ansiEscapes.cursorLeft;
                var time = Date.now();
                if (time >= this.nextRender) {
                    this.nextRender = time + this.interval;
                    this.push(this.lastRenderedDisplay);
                }
                else {
                    // this.push('');
                }
            }
        }
        callback();
    };
    ConsoleAdapter.prototype._flush = function (callback) {
        this.push(this.lastRenderedDisplay + os_1.EOL);
    };
    return ConsoleAdapter;
}(stream_1.Transform));
exports.ConsoleAdapter = ConsoleAdapter;
//# sourceMappingURL=console-adapter.js.map