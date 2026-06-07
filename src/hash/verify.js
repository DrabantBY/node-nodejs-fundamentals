import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";

const verify = async () => {
  try {
    let json = "";

    for await (const chunk of createReadStream(resolve("checksums.json"))) {
      json += chunk;
    }

    const checksums = JSON.parse(json);

    for (const fileName of Object.keys(checksums)) {
      const hash = createHash("sha256");

      for await (const chunk of createReadStream(resolve(fileName))) {
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
