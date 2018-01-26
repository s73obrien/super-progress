import { Progress } from '../super-progress';
import { EXAMPLE_TOKENS } from './example-tokens';

export function example(): Progress {
  return Progress.create({
    pattern: '{spinner}--{spinner} {indeterminate} {bar} {indeterminate} {spinner}--{spinner}'
  },
    EXAMPLE_TOKENS);
}
