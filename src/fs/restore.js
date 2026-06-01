import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { cwd } from "node:process";

const restore = async () => {
  try {
    const targetFile = resolve(cwd(), "snapshot.json");
    const targetDir = resolve(cwd(), "workspace_restored");

    const data = await readFile(targetFile, "utf8");
    const { entries } = JSON.parse(data);

    await mkdir(targetDir, { recursive: true });

    for (const { type, path, content } of entries) {
      if (type === "directory") {
        await mkdir(join(targetDir, path), { recursive: true });
      }

      if (type === "file") {
        await writeFile(join(targetDir, path), content, "base64");
      }
    }
  } catch {
    throw new Error("FS operation failed");
  }
};

await restore();
