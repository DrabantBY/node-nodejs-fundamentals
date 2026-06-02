import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

const getPath = (fileName) => resolve(cwd(), fileName);

const verify = async () => {
  try {
    let json = "";

    for await (const chunk of createReadStream(
      getPath("checksums.json"),
      "utf-8",
    )) {
      json += chunk;
    }

    const checksums = JSON.parse(json);

    for (const fileName of Object.keys(checksums)) {
      const hash = createHash("sha256");

      for await (const chunk of createReadStream(getPath(fileName))) {
        hash.update(chunk);
      }

      console.log(
        `${fileName} — ${hash.digest("hex") === checksums[fileName] ? "OK" : "FAIL"}`,
      );
    }
  } catch {
    throw new Error("FS operation failed");
  }
};

await verify();
