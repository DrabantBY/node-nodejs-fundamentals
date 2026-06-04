import { createWriteStream } from "node:fs";
import { mkdir, readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress } from "node:zlib";

const compressDir = async () => {
  try {
    const sourceDir = resolve(cwd(), "workspace", "toCompress");
    const targetDir = resolve(cwd(), "workspace", "compressed");

    await mkdir(targetDir, { recursive: true });

    const files = await readdir(sourceDir, {
      recursive: true,
      withFileTypes: true,
    });

    const data = [];

    for (const file of files) {
      if (file.isDirectory()) {
        data.push({
          path: relative(sourceDir, join(file.parentPath, file.name)),
        });
      }

      if (file.isFile()) {
        const path = join(file.parentPath, file.name);
        const text = await readFile(path);

        data.push({
          path: relative(sourceDir, path),
          text,
        });
      }
    }

    await pipeline(
      Readable.from(JSON.stringify(data)),
      createBrotliCompress(),
      createWriteStream(join(targetDir, "archive.br")),
    );
  } catch {
    throw new Error("FS operation failed");
  }
};

await compressDir();
