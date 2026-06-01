import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { pipeline } from "node:stream/promises";
import { createBrotliDecompress } from "node:zlib";

const decompressDir = async () => {
  try {
    const sourceFile = resolve(cwd(), "workspace", "compressed", "archive.br");
    const targetDir = resolve(cwd(), "workspace", "decompressed");

    await mkdir(targetDir, { recursive: true });

    const chunks = [];

    await pipeline(
      createReadStream(sourceFile),
      createBrotliDecompress(),
      async function* (source) {
        for await (const chunk of source) {
          chunks.push(chunk);
          yield;
        }
      },
    );

    const data = JSON.parse(Buffer.concat(chunks).toString());

    for (const { path, text } of data) {
      if (text === undefined) {
        await mkdir(join(targetDir, path), { recursive: true });
      } else {
        await writeFile(join(targetDir, path), text, "utf8");
      }
    }
  } catch {
    throw new Error("FS operation failed");
  }
};

await decompressDir();
