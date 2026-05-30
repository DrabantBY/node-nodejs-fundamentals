import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { parseArgs } from "node:util";

const getParams = () => {
  const { values } = parseArgs({
    options: {
      ext: { type: "string", default: "txt" },
    },
  });
  return values.ext;
};

const findByExt = async () => {
  const ext = getParams();

  try {
    const files = await readdir(resolve(cwd(), "workspace"), {
      recursive: true,
    });

    const extFiles = files
      .filter((file) => file.endsWith(`.${ext}`))
      .sort((a, b) => a.localeCompare(b));

    for (const file of extFiles) {
      console.log(file);
    }
  } catch {
    throw new Error("FS operation failed");
  }
};

await findByExt();
