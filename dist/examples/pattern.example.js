"use strict";
exports.__esModule = true;
var super_progress_1 = require("../super-progress");
var example_tokens_1 = require("./example-tokens");
function example() {
    return super_progress_1.Progress.create(process.stdout.columns - 1, {
        pattern: '{spinner}--{spinner} {indeterminate} {bar} {indeterminate} {spinner}--{spinner}'
    }, example_tokens_1.EXAMPLE_TOKENS);
}
exports.example = example;
//# sourceMappingURL=pattern.example.js.map