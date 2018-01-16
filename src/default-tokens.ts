import { ProgressTokenDefinition, ProgressState } from './ts-progress';
import { EOL } from 'os';

  export const defaultTokenDefinitions: ProgressTokenDefinition[] = [
    {
      // the bar token displays a bar showing how much of a process has
      // completed.  It takes up as much space as the layout engine will
      // allow.  This is specified by returning -1 in the width function.
      token: 'bar',
      render: (state: ProgressState, allowed: number): string => {
        let percent = state.percentComplete;
        if (percent > 1.00) {
          percent = 1;
        }

        let complete = Math.floor(allowed * percent);

        return '='.repeat(complete) + '-'.repeat(allowed - complete);
      },
      width: () => -1
    },
    {
      // the elapsed token displays the amount time that has elapsed since
      // the beginning of the process.  It is displayed in HH:MM:SS.ZZZ format.
      // Since we know the exact width of the desired output, we return it
      // in the width function.
      token: 'elapsed',
      render: (state: ProgressState, allowed: number): string => {
        let seconds = (state.elapsedTime / 1000) % 60;
        let minutes = Math.floor((state.elapsedTime / 1000 / 60) % 60);
        let hours = Math.floor((state.elapsedTime / 1000 / 60 / 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
      },
      width: () => 12
    },
    {
      // the percent token displays the amount of the process that has been
      // completed as a percentage.  It shows 2 decimal places of precision.
      token: 'percent',
      render: (state: ProgressState, allowed: number): string => {
        return (state.percentComplete * 100).toFixed(2) + '%';
      },
      width: () => 7
    },
    {
      // The spinner token simply displays an ascii 'wheel' that constantly
      // spins as the process is occurring.
      token: 'spinner',
      render: (state: ProgressState, allowed: number): string => {
        const frames: string[] = [
          '-',
          '\\',
          '|',
          '/'
        ]

        return frames[state.currentTicks % frames.length];
      },
      width: () => 1
    },
    {
      // The indeterminate token is the big brother to the spinner token.
      // Same idea, just expanded.
      token: 'indeterminate',
      render: (state: ProgressState, allowed: number): string => {
        const frames: string[] = [
          'P         ',
          '          ',
          ' R        ',
          '          ',
          '  O       ',
          '          ',
          '   C      ',
          '          ',
          '    E     ',
          '          ',
          '     S    ',
          '          ',
          '      S   ',
          '          ',
          '       I  ',
          '          ',
          '        N ',
          '          ',
          '         G',
          '          ',
          'PROCESSING',
          'PROCESSING',
          '          ',
          '          ',
          'PROCESSING',
          'PROCESSING',
          '          ',
          '          ',
          'PROCESSING',
          'PROCESSING',
          '          ',
          '          ',
        ]

        return frames[Math.floor(state.currentTicks) % frames.length];
      },
      width: () => 10
    },
    {
      // The status token displays a specific message depending upon which part
      // of the process is occurring.
      token: 'status',
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
  ];

