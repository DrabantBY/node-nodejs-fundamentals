import { Transform } from "node:stream";

const lineNumberer = () => {
  let counter = 1;
  const transform = new Transform({
    transform(chunk, _, callback) {
      this.push(
        `${chunk}`
          .split(/\n/)
          .reduce((str, el) => (el ? `${str}${counter++} | ${el}\n` : str), ""),
      );
      callback();
    },
  });

  process.stdin.pipe(transform).pipe(process.stdout);
};

lineNumberer();
