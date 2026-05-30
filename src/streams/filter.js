import { parseArgs } from "node:util";
import { Transform } from "node:stream";

const getParams = () => {
  const { values } = parseArgs({
    options: {
      pattern: { type: "string", default: "" },
    },
  });

  return values.pattern;
};

const filter = () => {
  const pattern = getParams();

  const transform = new Transform({
    transform(chunk, _, callback) {
      this.push(
        `${chunk}`
          .split("\n")
          .reduce(
            (str, line) => (line.includes(pattern) ? `${str}${line}\n` : str),
            "",
          ),
      );
      callback();
    },
  });
  process.stdin.pipe(transform).pipe(process.stdout);
};

filter();
