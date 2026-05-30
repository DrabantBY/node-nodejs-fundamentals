import { stdout } from "node:process";
import { parseArgs } from "node:util";

const getParams = () => {
  const { values } = parseArgs({
    options: {
      duration: {
        type: "string",
        default: "5000",
      },
      interval: {
        type: "string",
        default: "100",
      },
      length: {
        type: "string",
        default: "30",
      },
      color: {
        type: "string",
      },
    },
  });

  return {
    duration: Number(values.duration),
    interval: Number(values.interval),
    length: Number(values.length),
    color: values.color,
  };
};

const getColor = (color) => {
  if (!color || !/^#[a-f\d]{6}$/i.test(color)) return "";

  const rgb = color
    .match(/[a-f\d]{2}/gi)
    .map((part) => parseInt(part, 16))
    .join(";");

  return `\x1b[38;2;${rgb}m`;
};

const progress = () => {
  const { duration, interval, length, color } = getParams();

  let counter = duration;

  const rgb = getColor(color);

  stdout.write(`\r[${" ".repeat(length)}] 0%`);

  const timer = setInterval(() => {
    counter -= interval;

    const rate = Math.min((duration - counter) / duration, 1);
    const size = Math.round(rate * length);
    const body = `${rgb}${"█".repeat(size)}\x1b[0m${" ".repeat(length - size)}`;

    stdout.write(`\r[${body}] ${Math.round(rate * 100)}%`);

    if (counter < 0) {
      clearInterval(timer);
      console.log("\nDone!");
    }
  }, interval);
};

progress();
