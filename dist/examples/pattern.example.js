"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var super_progress_1 = require("../super-progress");
var example_tokens_1 = require("./example-tokens");
function example() {
    return super_progress_1.Progress.create({
        pattern: '{spinner}--{spinner} {indeterminate} {bar} {indeterminate} {spinner}--{spinner}'
    }, example_tokens_1.EXAMPLE_TOKENS);
}
exports.example = example;
//# sourceMappingURL=pattern.example.js.map