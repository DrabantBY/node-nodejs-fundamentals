import { Transform } from "node:stream";

const lineNumberer = () => {
  const transform = new Transform({
    transform(chunk, _, callback) {
      this.push(
        `${chunk}`
          .split("\n")
          .reduce((str, el, i) => (el ? `${str}${i + 1} | ${el}\n` : str), ""),
      );
      callback();
    },
  });

  process.stdin.pipe(transform).pipe(process.stdout);
};

lineNumberer();
