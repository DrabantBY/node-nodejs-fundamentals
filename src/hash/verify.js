import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";

const calcHash = async (fileName) => {
  try {
    const hash = createHash("sha256");
    await pipeline(createReadStream(resolve(fileName)), hash);
    return hash.digest("hex");
  } catch {
    return null;
  }
};

const verify = async () => {
  try {
    let json = "";

    for await (const chunk of createReadStream(resolve("checksums.json"))) {
      json += chunk;
    }

    const checksums = JSON.parse(json);

    for (const fileName of Object.keys(checksums)) {
      const hash = await calcHash(fileName);

      console.log(
        `${fileName} — ${hash === checksums[fileName] ? "OK" : "FAIL"}`,
      );
    }
  } catch {
    throw new Error("FS operation failed");
  }
};

await verify();
