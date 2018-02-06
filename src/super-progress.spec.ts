import { Progress, ProgressState } from './super-progress';
const StreamTest = require('streamtest');

describe(`--Progress--`, () => {
  describe('-Construction-', () => {
    let defaultState: ProgressState;

    beforeEach(() => {
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
      }
    });

    it(`accepts a pattern string that contains tokens`,
      done => {
        let pb = Progress.create(
          100,
          {
            pattern: 'patterned string with {tokens}'
          });

        expect(pb.options.pattern).toEqual(`patterned string with {tokens}`)

        done();
      }
    );

    it(`has defaults for every property in the ProgressOptions argument to the
      constructor, even if only one property is set`,
      done => {
        let pb = Progress.create(100);
        expect(pb.options.pattern).toEqual(`[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`);
        expect(pb.options.total).toEqual(100);
        expect(pb.options.renderInterval).toEqual(33);

        pb = Progress.create(
          100,
          {
            pattern: 'new pattern'
          });
        expect(pb.options.pattern).toEqual(`new pattern`);
        expect(pb.options.total).toEqual(100);
        expect(pb.options.renderInterval).toEqual(33);

        pb = Progress.create(
          100,
          {
            total: 500
          });
        expect(pb.options.pattern).toEqual(`[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`);
        expect(pb.options.total).toEqual(500);
        expect(pb.options.renderInterval).toEqual(33);

        pb = Progress.create(
          100,
          {
            renderInterval: 1000
          });
        expect(pb.options.pattern).toEqual(`[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`);
        expect(pb.options.total).toEqual(100);
        expect(pb.options.renderInterval).toEqual(1000);

        done();
      });

    it(`accepts a ProgressState object that allows the progress bar to resume`,
      done => {
        let pb = Progress.create(100);

        for (let i = 0; i < 50; i++) {
          pb.update();
        }

        let state = pb.state;

        let pb2 = Progress.create(
          100,
          undefined,
          undefined,
          state);
        pb2.update()
          .then(() => {
            expect(pb2.state.currentTicks).toEqual(state.currentTicks + 1);
            done();
          });
      });

    it(`accepts a set of custom token definitions
      that define the various tokens in the pattern string`,
      done => {
        let pb = Progress.create(
          100,
          undefined,
          {
            token1: {
              render: () => `TOKEN`,
              width: () => 5
            },
            token2: {
              render: () => `TOKEN2`,
              width: () => 6
            }
          }
        );

        expect(pb.tokens.token1.render(defaultState, 0)).toEqual(`TOKEN`);
        expect(pb.tokens.token1.width(defaultState)).toEqual(5);

        expect(pb.tokens.token2.render(defaultState, 0)).toEqual(`TOKEN2`);
        expect(pb.tokens.token2.width(defaultState)).toEqual(6);

        done();
      }
    );

    it(`replaces default tokens with custom tokens
       when there is a collision between the keys
       of two tokens`,
      done => {
        let pb = Progress.create(
          100,
          undefined,
          {
            bar: {
              render: () => `replaced bar`,
              width: () => 12
            }
          }
        );

        expect(pb.tokens.bar.render(defaultState, 0)).toEqual(`replaced bar`);
        expect(pb.tokens.bar.width(defaultState)).toEqual(12);
        done();
      });
  });

  describe(`-Rendering-`, () => {
    it(`renders a token with spaces correctly`,
      done => {
        let pb = Progress.create(
          100,
          {
            pattern: `{token with spaces}`
          },
          {
            'token with spaces': {
              render: () => 'SPECIAL TOKEN',
              width: () => 13
            }
          }
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0]).toContain(`SPECIAL TOKEN`);
          done();
        })
      })

    it(`provides to a variable-width token the space remaining
        on a line after accounting for non-token characters and
        fixed-width tokens`,
      done => {
        const nonToken: string = `Non-token characters`;
        const mockRender = jest.fn(() => 'MOCK_RENDER');
        const tokens = {
          'fixed': {
            render: () => '[Fixed-Width Token]',
            width: () => 19
          },
          'variable': {
            render: mockRender,
            width: () => -1
          }
        };

        let pb = Progress.create(
          100,
          {
            pattern: `${nonToken}{fixed}{variable}`
          },
          tokens);

        pb.render().then((rendered: string[]) => {
          const expectedAlloc = pb.width - nonToken.length - tokens.fixed.width();
          expect(mockRender.mock.calls[0][1]).toEqual(expectedAlloc);
          done();
        });
      });

    it(`outputs lines that are exactly as long as requested, even when the
        rendered tokens are narrower than the width returned by the token`,
      done => {
        const tokens = {
          'too small fixed': {
            render: () => 'too small fixed',
            width: () => 90
          },
          'too small variable': {
            render: () => 'too small variable',
            width: () => -1
          }
        }

        let pb = Progress.create(
          200,
          {
            pattern: `{too small fixed}`
          },
          tokens
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0].length).toEqual(pb.width);
        })

        pb = Progress.create(
          200,
          {
            pattern: `{too small variable}`
          },
          tokens
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0].length).toEqual(pb.width);
          done();
        })
      });

    it(`outputs lines that are exactly as long as requested, even when the
        rendered tokens are wider than the width returned by the token`,
      done => {
        const tokens = {
          'too long fixed': {
            render: () => 'too long fixed'.repeat(90),
            width: () => 10
          },
          'too long variable': {
            render: () => 'too long variable'.repeat(90),
            width: () => -1
          }
        };

        let pb = Progress.create(
          200,
          {
            pattern: `{too long fixed}`
          },
          tokens
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0].length).toEqual(pb.width);
        });

        pb = Progress.create(
          200,
          {
            pattern: `{too long variable}`
          },
          tokens
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0].length).toEqual(pb.width);
          done();
        })
      })

    it(`truncates a token that is longer than the width it returns`,
      done => {
        const compliant = `this string should break -->`;
        const noncompliant = `<-- here`;
        const tokens = {
          'shady token': {
            render: () => `${compliant}${noncompliant}`,
            width: () => compliant.length
          }
        }

        let pb = Progress.create(
          200,
          {
            pattern: `{shady token}`
          },
          tokens
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0].match('><')).toBeNull;
          expect(rendered[0].trimRight()).toEqual(compliant);
          done();
        });
      })

    it(`pads a token that is shorter than the width it returns`,
      done => {
        const tokens = {
          'shrimpy token': {
            render: () => `shrimpy token`,
            width: () => 30
          }
        };

        let pb = Progress.create(
          200,
          {
            pattern: `{shrimpy token}|`
          },
          tokens
        );

        pb.render().then((rendered: string[]) => {
          expect(rendered[0].split('|')[0].length).toEqual(30);
          expect(rendered[0]).toEqual(`shrimpy token${' '.repeat(17)}|${' '.repeat(169)}`);
          done();
        })
      })
  })
  describe('-Streams-', () => {
    it(`reads a writable data stream and outputs an array of strings
        representing the progress bar`,
      done => {
        StreamTest.versions.forEach((version: string) => {
          let ps = Progress.create(
            14,
            {
              pattern: `{token}`
            },
            {
              token: {
                render: () => `RENDERED TOKEN`,
                width: () => 14
              }
            });

          StreamTest[version].fromChunks(['random data'])
            .pipe(ps)
            .pipe(StreamTest[version].toObjects((err: any, objects: string[]) => {
              expect(objects).toMatchObject([['RENDERED TOKEN']]);
              done();
            }))
        });
      })
  })
})
