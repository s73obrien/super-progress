"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var default_tokens_1 = require("./default-tokens");
var readline_1 = require("readline");
var os_1 = require("os");
var stringWidth = require('string-width');
var Progress = /** @class */ (function () {
    function Progress(options, tokens, state) {
        this.options = options;
        this.tokens = tokens;
        this.state = state;
    }
    Progress.prototype.display = function (rendered, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var time;
            return __generator(this, function (_a) {
                time = Date.now();
                if (time >= this.state.nextRender) {
                    this.state.nextRender = time + this.options.renderInterval;
                    stream.write(rendered.join(os_1.EOL));
                    readline_1.moveCursor(stream, 0, -1 * (rendered.length - 1));
                    readline_1.cursorTo(stream, 0);
                }
                return [2 /*return*/];
            });
        });
    };
    Progress.prototype.update = function (ticks) {
        if (ticks === void 0) { ticks = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.state.currentTicks += ticks; // ticks
                this.state.percentComplete = this.state.currentTicks / this.state.totalTicks; // raw decimal
                this.state.elapsedTime = Date.now() - this.state.startTime; // ms
                this.state.ticksLeft = this.state.totalTicks - this.state.currentTicks; // ticks
                this.state.rateTicks = this.state.currentTicks / this.state.elapsedTime; // ticks/ms
                this.state.remainingTime = this.state.ticksLeft / this.state.rateTicks; // ms
                return [2 /*return*/];
            });
        });
    };
    Progress.prototype.complete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.state.currentTicks = this.state.totalTicks;
                this.state.percentComplete = 1.0;
                this.state.elapsedTime = Date.now() - this.state.startTime;
                this.state.ticksLeft = 0;
                this.state.rateTicks = this.state.currentTicks / this.state.elapsedTime;
                this.state.remainingTime = 0;
                return [2 /*return*/];
            });
        });
    };
    Progress.prototype.render = function (width) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var lines;
            return __generator(this, function (_a) {
                lines = this.options.pattern.split(/\r\n|\r|\n/g);
                return [2 /*return*/, Promise.all(lines.map(function (s) { return _this.renderLine(s, width); }))];
            });
        });
    };
    Progress.prototype.renderLine = function (line, available) {
        return __awaiter(this, void 0, void 0, function () {
            var spaceTaken, stars, leftovers, widths, token, matches, spaceAvailable, spacePerStar, rendered, token, renderedToken, expectedWidth, renderedTokenWidth, renderedWidth;
            return __generator(this, function (_a) {
                spaceTaken = 0;
                stars = 0;
                leftovers = line;
                widths = {};
                // loop through each token and acquire the length for each
                // if the token returns a -1 instead of a width, then
                // we will tell it how much space it has on the next pass
                for (token in this.tokens) {
                    leftovers = leftovers.replace(new RegExp("{" + token + "}", 'g'), '');
                    matches = line.match(new RegExp("{" + token + "}", 'g'));
                    if (matches !== null) {
                        widths[token] = this.tokens[token].width(this.state);
                        if (widths[token] === -1) {
                            stars += matches.length;
                        }
                        else {
                            spaceTaken += (matches.length * widths[token]);
                        }
                    }
                }
                spaceAvailable = Math.max(0, available - leftovers.length - spaceTaken);
                spacePerStar = 0;
                if (stars > 0) {
                    spacePerStar = Math.floor(spaceAvailable / stars);
                }
                rendered = line;
                for (token in widths) {
                    renderedToken = this.tokens[token].render(this.state, spacePerStar);
                    expectedWidth = widths[token] === -1 ? spacePerStar : widths[token];
                    renderedTokenWidth = stringWidth(renderedToken);
                    if (renderedTokenWidth < expectedWidth) {
                        renderedToken = renderedToken + ' '.repeat(expectedWidth - renderedTokenWidth);
                    }
                    else if (renderedTokenWidth > expectedWidth) {
                        renderedToken = renderedToken.substring(0, expectedWidth);
                    }
                    rendered = rendered.replace(new RegExp("{" + token + "}", 'g'), renderedToken);
                }
                renderedWidth = stringWidth(rendered);
                if (renderedWidth < available) {
                    rendered = rendered + ' '.repeat(available - renderedWidth);
                }
                //  else if (renderedWidth > available) {
                //   rendered = rendered.substring(0, available - 1);
                // }
                return [2 /*return*/, rendered];
            });
        });
    };
    Progress.create = function (options, tokens, state) {
        var o = __assign({}, Progress.defaultProgressOptions, options);
        o.pattern = o.pattern;
        o.total = o.total;
        o.renderInterval = o.renderInterval;
        var t = __assign({}, default_tokens_1.defaultTokenDefinitions, tokens);
        var s = __assign({ elapsedTime: 0, remainingTime: 0, percentComplete: 0, currentTicks: 0, rateTicks: 0, nextRender: 0, startTime: Date.now(), totalTicks: 100, ticksLeft: 100 }, state);
        if (o.total) {
            s.totalTicks = o.total;
            s.ticksLeft = o.total;
        }
        return new Progress(o, t, s);
    };
    Progress.defaultProgressOptions = {
        total: 100,
        pattern: "[{spinner}] {bar} | Elapsed: {elapsed} | {percent}",
        renderInterval: 33
    };
    return Progress;
}());
exports.Progress = Progress;
//# sourceMappingURL=super-progress.js.map