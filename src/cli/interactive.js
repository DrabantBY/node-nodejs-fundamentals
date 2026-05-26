import { createInterface } from "node:readline/promises";
import { stdin, stdout, uptime, cwd } from "node:process";

const interactive = async () => {
  const rl = createInterface({ input: stdin, output: stdout });
  rl.on("close", () => console.log("Goodbye!"));
  rl.on("SIGINT", () => rl.close());

  while (true) {
    const line = await rl.question("> ");

    switch (line.trim()) {
      case "uptime": {
        console.log(`Uptime: ${uptime().toFixed(2)}s`);
        break;
      }

      case "cwd": {
        console.log(cwd());
        break;
      }

      case "date": {
        console.log(new Date().toISOString());
        break;
      }

      case "exit": {
        rl.close();
        return;
      }

      default: {
        console.log("Unknown command");
      }
    }
  }
};

interactive();
