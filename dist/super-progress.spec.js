"use strict";
exports.__esModule = true;
var super_progress_1 = require("./super-progress");
describe("--Progress--", function () {
    describe('-Construction-', function () {
        var defaultState;
        beforeEach(function () {
            defaultState = {
                startTime: 0,
                elapsedTime: 0,
                remainingTime: 0,
                percentComplete: 0,
                currentTicks: 0,
                rateTicks: 0,
                totalTicks: 100,
                ticksLeft: 100,
                nextRender: 0
            };
        });
        it("accepts a pattern string that contains tokens", function (done) {
            var pb = super_progress_1.Progress.create({
                pattern: 'patterned string with {tokens}'
            });
            expect(pb.options.pattern).toEqual("patterned string with {tokens}");
            done();
        });
        it("has defaults for every property in the ProgressOptions argument to the\n      constructor, even if only one property is set", function (done) {
            var pb = super_progress_1.Progress.create();
            expect(pb.options.pattern).toEqual("[{spinner}] {bar} | Elapsed: {elapsed} | {percent}");
            expect(pb.options.total).toEqual(100);
            expect(pb.options.renderInterval).toEqual(33);
            pb = super_progress_1.Progress.create({
                pattern: 'new pattern'
            });
            expect(pb.options.pattern).toEqual("new pattern");
            expect(pb.options.total).toEqual(100);
            expect(pb.options.renderInterval).toEqual(33);
            pb = super_progress_1.Progress.create({
                total: 500
            });
            expect(pb.options.pattern).toEqual("[{spinner}] {bar} | Elapsed: {elapsed} | {percent}");
            expect(pb.options.total).toEqual(500);
            expect(pb.options.renderInterval).toEqual(33);
            pb = super_progress_1.Progress.create({
                renderInterval: 1000
            });
            expect(pb.options.pattern).toEqual("[{spinner}] {bar} | Elapsed: {elapsed} | {percent}");
            expect(pb.options.total).toEqual(100);
            expect(pb.options.renderInterval).toEqual(1000);
            done();
        });
        it("accepts a ProgressState object that allows the progress bar to resume", function (done) {
            var pb = super_progress_1.Progress.create();
            for (var i = 0; i < 50; i++) {
                pb.update();
            }
            var state = pb.state;
            var pb2 = super_progress_1.Progress.create(undefined, undefined, state);
            pb2.update()
                .then(function () {
                expect(pb2.state.currentTicks).toEqual(state.currentTicks + 1);
                done();
            });
        });
        it("accepts a set of custom token definitions\n      that define the various tokens in the pattern string", function (done) {
            var pb = super_progress_1.Progress.create(undefined, {
                token1: {
                    render: function () { return "TOKEN"; },
                    width: function () { return 5; }
                },
                token2: {
                    render: function () { return "TOKEN2"; },
                    width: function () { return 6; }
                }
            });
            expect(pb.tokens.token1.render(defaultState, 0)).toEqual("TOKEN");
            expect(pb.tokens.token1.width(defaultState)).toEqual(5);
            expect(pb.tokens.token2.render(defaultState, 0)).toEqual("TOKEN2");
            expect(pb.tokens.token2.width(defaultState)).toEqual(6);
            done();
        });
        it("replaces default tokens with custom tokens\n       when there is a collision between the keys\n       of two tokens", function (done) {
            var pb = super_progress_1.Progress.create(undefined, {
                bar: {
                    render: function () { return "replaced bar"; },
                    width: function () { return 12; }
                }
            });
            expect(pb.tokens.bar.render(defaultState, 0)).toEqual("replaced bar");
            expect(pb.tokens.bar.width(defaultState)).toEqual(12);
            done();
        });
    });
    describe("-Rendering-", function () {
        it("renders a token with spaces correctly", function (done) {
            var pb = super_progress_1.Progress.create({
                pattern: "{token with spaces}"
            }, {
                'token with spaces': {
                    render: function () { return 'SPECIAL TOKEN'; },
                    width: function () { return 13; }
                }
            });
            pb.render(100).then(function (rendered) {
                expect(rendered[0]).toContain("SPECIAL TOKEN");
                done();
            });
        });
        it("provides to a variable-width token the space remaining\n        on a line after accounting for non-token characters and\n        fixed-width tokens", function (done) {
            var nonToken = "Non-token characters";
            var mockRender = jest.fn(function () { return 'MOCK_RENDER'; });
            var tokens = {
                'fixed': {
                    render: function () { return '[Fixed-Width Token]'; },
                    width: function () { return 19; }
                },
                'variable': {
                    render: mockRender,
                    width: function () { return -1; }
                }
            };
            var pb = super_progress_1.Progress.create({
                pattern: nonToken + "{fixed}{variable}"
            }, tokens);
            pb.render(100).then(function (rendered) {
                var expectedAlloc = 100 - nonToken.length - tokens.fixed.width() - 1;
                expect(mockRender.mock.calls[0][1]).toEqual(expectedAlloc);
                done();
            });
        });
        it("outputs lines that are exactly as long as requested, even when the\n        rendered tokens are narrower than the width returned by the token", function (done) {
            var tokens = {
                'too small fixed': {
                    render: function () { return 'too small fixed'; },
                    width: function () { return 90; }
                },
                'too small variable': {
                    render: function () { return 'too small variable'; },
                    width: function () { return -1; }
                }
            };
            var pb = super_progress_1.Progress.create({
                pattern: "{too small fixed}"
            }, tokens);
            pb.render(200).then(function (rendered) {
                expect(rendered[0].length).toEqual(200);
            });
            pb = super_progress_1.Progress.create({
                pattern: "{too small variable}"
            }, tokens);
            pb.render(200).then(function (rendered) {
                expect(rendered[0].length).toEqual(200);
                done();
            });
        });
        it("outputs lines that are exactly as long as requested, even when the\n        rendered tokens are wider than the width returned by the token", function (done) {
            var tokens = {
                'too long fixed': {
                    render: function () { return 'too long fixed'.repeat(90); },
                    width: function () { return 10; }
                },
                'too long variable': {
                    render: function () { return 'too long variable'.repeat(90); },
                    width: function () { return -1; }
                }
            };
            var pb = super_progress_1.Progress.create({
                pattern: "{too long fixed}"
            }, tokens);
            pb.render(200).then(function (rendered) {
                expect(rendered[0].length).toEqual(200);
            });
            pb = super_progress_1.Progress.create({
                pattern: "{too long variable}"
            }, tokens);
            pb.render(200).then(function (rendered) {
                expect(rendered[0].length).toEqual(200);
                done();
            });
        });
        it("truncates a token that is longer than the width it returns", function (done) {
            var compliant = "this string should break -->";
            var noncompliant = "<-- here";
            var tokens = {
                'shady token': {
                    render: function () { return "" + compliant + noncompliant; },
                    width: function () { return compliant.length; }
                }
            };
            var pb = super_progress_1.Progress.create({
                pattern: "{shady token}"
            }, tokens);
            pb.render(200).then(function (rendered) {
                expect(rendered[0].match('><')).toBeNull;
                expect(rendered[0].trimRight()).toEqual(compliant);
                done();
            });
        });
    });
});
//# sourceMappingURL=super-progress.spec.js.map