import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { createInterface } from "node:readline";
import { parseArgs } from "node:util";

const getLines = () => {
  const { values } = parseArgs({
    options: {
      lines: { type: "string", default: "10" },
    },
  });
  return Number(values.lines);
};

const split = async () => {
  const lines = getLines();

  let chunksCount = 1;
  let lineCounter = 0;

  let writeStream = createWriteStream(
    resolve(cwd(), `chunk_${chunksCount}.txt`),
    "utf-8",
  );

  const readStream = createReadStream(resolve(cwd(), "source.txt"), "utf-8");

  const readLine = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  for await (const line of readLine) {
    writeStream.write(`${line}\n`);
    lineCounter++;

    if (lineCounter === lines) {
      chunksCount++;

      lineCounter = 0;

      writeStream.end();

      writeStream = createWriteStream(
        resolve(cwd(), `chunk_${chunksCount}.txt`),
        "utf-8",
      );
    }
  }

  writeStream.end();
};

await split();
