import { Progress } from '../super-progress';
import { EXAMPLE_TOKENS } from './example-tokens';

export function example(): Progress {
  return Progress.create(
    process.stdout.columns! - 1,
    {
      pattern: '{spinner}--{spinner} {indeterminate} {bar} {indeterminate} {spinner}--{spinner}'
    },
    EXAMPLE_TOKENS);
}
