import { appendFile, readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { parseArgs } from "node:util";

const getParams = () => {
  const { values } = parseArgs({
    options: {
      files: {
        type: "string",
      },
    },
  });

  return values.files?.split(",");
};

const merge = async () => {
  try {
    const names = getParams();

    const targetDir = resolve(cwd(), "workspace", "parts");
    const targetFile = resolve(cwd(), "workspace", "merged.txt");

    const entries = await readdir(targetDir, {
      withFileTypes: true,
      recursive: true,
    });

    const files = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          (names?.includes(entry.name) ||
            (!names && entry.name.endsWith(".txt"))),
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    if (files.length === 0) {
      throw new Error();
    }

    for (const { parentPath, name } of files) {
      const data = await readFile(join(parentPath, name));
      await appendFile(targetFile, data);
    }
  } catch {
    throw new Error("FS operation failed");
  }
};

await merge();
