# Super Progress Bar

Super progress bar is a CLI progress bar.

![](default.gif "Super Progress Bar - default implementation")

It accepts a pattern string that contains tokens that represent the different fields that can be output in the progress bar.

```typescript
// Default pattern string
let pb = Progress.create({
  pattern: `[{spinner}] {bar} | Elapsed: {elapsed} | {percent}`
});
```

It also accepts a set of custom token definitions that define the various tokens in the pattern string as well as how to render each token.

```typescript
// Example token definition
{
  percent: {
    render: (state: ProgressState, allowed: number): string => {
      return (state.percentComplete * 100).toFixed(2) + '%';
    },
    width: () => 7
  }
}
```
### Token Definition
Each token is specified within the pattern string by its key, surrounded by curly braces (ex. ```{bar}```).  If a custom token has the same key as a default token, the default token is replaced.

Each token definition is composed of three parts:
- It's key, which you insert into the pattern string to indicate where to put the rendered token
- A function that returns a number indicating the width of the rendered token, in single characters.  Each token may instead return a -1 to to indicate that it will take as much space as is available (more on that below)
- A function that returns the rendered token

### Rendering
The progress bar rendering function uses a two-pass process to render the whole bar.

On the first pass, each token is queried for its rendered width. If a token returns a -1 instead of a width, this indicates that the token is variable-width and will use the space allotted to it by the render function.

On the second pass, all of the widths of the known-width tokens and 'literal' characters (characters that are not a part of any known token) in the pattern string are added together and subtracted from the space available in the console.  The amount left over (if any) is then divided evenly across all of the tokens that returned a -1 on the first pass.  Every token's render function is then called with the current state of the progress bar and the allowed width per unknown-width token as arguments.  The return value of each render function is then inserted in place of the token's placeholder(s) in the pattern string.

## Installation

## Usage

### Typescript
```typescript
// Note: Import from 'super-progress/super-progress'
// in Typescript
import { Progress } from 'super-progress/super-progress';
import { clearInterval } from 'timers';

const pb = Progress.create();

let t = setInterval(() => {
  pb.update()
    .then(() => pb.render(process.stdout.columns))
    .then(r => pb.display(r, process.stdout))
    .then(() => {
      if (pb.state.percentComplete >= 1.0) {
        clearInterval(t);
      }
    })
}, 100);
```

### Javascript
```javascript
const progress = require('super-progress');

const pb = progress.create();

let t = setInterval(() => {
  pb.update()
    .then(() => pb.render(process.stdout.columns))
    .then(r => pb.display(r, process.stdout))
    .then(() => {
      if (pb.state.percentComplete >= 1.0) {
        clearInterval(t);
      }
    })
}, 100);
```