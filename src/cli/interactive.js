import { createInterface } from "node:readline/promises";

const interactive = async () => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });

  rl.on("SIGINT", rl.close);

  while (true) {
    const line = await rl.question("> ");

    switch (line.trim()) {
      case "uptime": {
        console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
        break;
      }

      case "cwd": {
        console.log(process.cwd());
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
