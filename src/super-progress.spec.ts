import { Progress, ProgressState } from './super-progress';

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
        let pb = Progress.create({
          pattern: 'patterned string with {tokens}'
        });

        expect(pb.options.pattern).toEqual(`patterned string with {tokens}`)

        done();
      }
    );

    it(`has defaults for every property in the ProgressOptions argument to the
      constructor, even if only one property is set`,
      done => {
        let pb = Progress.create();
        expect(pb.options.pattern).toEqual(`[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`);
        expect(pb.options.total).toEqual(100);
        expect(pb.options.renderInterval).toEqual(33);

        pb = Progress.create({
          pattern: 'new pattern'
        });
        expect(pb.options.pattern).toEqual(`new pattern`);
        expect(pb.options.total).toEqual(100);
        expect(pb.options.renderInterval).toEqual(33);

        pb = Progress.create({
          total: 500
        });
        expect(pb.options.pattern).toEqual(`[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`);
        expect(pb.options.total).toEqual(500);
        expect(pb.options.renderInterval).toEqual(33);

        pb = Progress.create({
          renderInterval: 1000
        });
        expect(pb.options.pattern).toEqual(`[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`);
        expect(pb.options.total).toEqual(100);
        expect(pb.options.renderInterval).toEqual(1000);

        done();
      });

    it(`accepts a ProgressState object that allows the progress bar to resume`,
      done => {
        let pb = Progress.create();

        for (let i = 0; i < 50; i++) {
          pb.update();
        }

        let state = pb.state;

        let pb2 = Progress.create(undefined, undefined, state);
        pb2.update()
        .then(() => {
          expect(pb2.state.currentTicks).toEqual(state.currentTicks + 1);
          done();
        });
      });

    it(`accepts a set of custom token definitions
      that define the various tokens in the pattern string`,
      done => {
        let pb = Progress.create(undefined, {
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
        let pb = Progress.create(undefined, {
          bar: {
            render: () => `replaced bar`,
            width: () => 12
          }
        });

        expect(pb.tokens.bar.render(defaultState, 0)).toEqual(`replaced bar`);
        expect(pb.tokens.bar.width(defaultState)).toEqual(12);
        done();
      });
  });

  describe(`-Rendering-`, () => {
    it(`renders a token with spaces correctly`,
      done => {
        let pb = Progress.create(
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

        pb.render(100).then((rendered: string[]) => {
          expect(rendered[0]).toEqual(`SPECIAL TOKEN`);
          done();
        })
      })

    it(`provides to a variable-width token the space remaining
        on a line after accounting for non-token characters and
        fixed-width tokens`,
      done => {
        const nonToken: string = `Non-token characters`;
        const mockRender = jest.fn();
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
          {
            pattern: `${nonToken}{fixed}{variable}`
          },
          tokens);

        pb.render(100).then((rendered: string[]) => {
          const expectedAlloc = 100 - nonToken.length - tokens.fixed.width() - 1;
          expect(mockRender.mock.calls[0][1]).toEqual(expectedAlloc);
          done();
        });
      });
  })
})
