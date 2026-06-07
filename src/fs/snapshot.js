import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const snapshot = async () => {
  try {
    const rootPath = resolve("workspace");
    const files = await readdir(rootPath, {
      recursive: true,
      withFileTypes: true,
    });

    const snapshot = { rootPath, entries: [] };

    for (const file of files) {
      if (file.isDirectory()) {
        snapshot.entries.push({
          path: relative(rootPath, join(file.parentPath, file.name)),
          type: "directory",
        });
      }

      if (file.isFile()) {
        const destPath = join(file.parentPath, file.name);
        const {
          0: { size },
          1: content,
        } = await Promise.all([stat(destPath), readFile(destPath, "base64")]);

        snapshot.entries.push({
          path: relative(rootPath, destPath),
          type: "file",
          size,
          content,
        });
      }
    }

    await writeFile(
      resolve("snapshot.json"),
      JSON.stringify(snapshot, null, 2),
    );
  } catch {
    throw new Error("FS operation failed");
  }
};

await snapshot();
