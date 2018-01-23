import { ProgressState, ProgressTokenDefinitions } from '../super-progress';

export const EXAMPLE_TOKENS: ProgressTokenDefinitions = {
  // The indeterminate token is the big brother to the spinner token.
  // Same idea, just expanded.
  indeterminate: {
    render: (state: ProgressState, allowed: number): string => {
      const frames: string[] = [
        '[>-      ]',
        '[->      ]',
        '[-->     ]',
        '[ -->    ]',
        '[  -->   ]',
        '[   -->  ]',
        '[    --> ]',
        '[     -->]',
        '[      -<]',
        '[      <-]',
        '[     <--]',
        '[    <-- ]',
        '[   <--  ]',
        '[  <--   ]',
        '[ <--    ]',
        '[<--     ]',
      ]

      return frames[Math.floor(state.currentTicks) % frames.length];
    },
    width: () => 10
  },

  // The status token displays a specific message depending upon which part
  // of the process is occurring.
  status: {
    render: (state: ProgressState, allowed: number): string => {
      let statusMessage;
      if (state.percentComplete < .1) {
        statusMessage = 'Just started';
      } else if (state.percentComplete >= .1 && state.percentComplete < .45) {
        statusMessage = 'Going strong';
      } else if (state.percentComplete >= .45 && state.percentComplete < .55) {
        statusMessage = 'Halfway now';
      } else if (state.percentComplete >= .55 && state.percentComplete < .9) {
        statusMessage = 'Home stretch';
      } else if (state.percentComplete >= .9 && state.percentComplete < 1) {
        statusMessage = 'Almost there';
      } else {
        statusMessage = 'All done!';
      }

      return statusMessage.padEnd(12, ' ');
    },
    width: () => 12
  }
}
