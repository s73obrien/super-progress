import { Progress } from '../super-progress';

export function example(): Progress {
  return Progress.create(process.stdout.columns! - 1);
}
