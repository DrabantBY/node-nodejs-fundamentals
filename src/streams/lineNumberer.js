import { Transform } from "node:stream";

const lineNumberer = () => {
  const transform = new Transform({
    transform(chunk, _, callback) {
      const lineNumberer = `${chunk}`
        .split("\n")
        .reduce(
          (str, line, index) => (line ? `${str}${index + 1} | ${line}\n` : str),
          "",
        );

      this.push(lineNumberer);
      callback();
    },
  });

  process.stdin.pipe(transform).pipe(process.stdout);
};

lineNumberer();
