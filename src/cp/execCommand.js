import { spawn } from "node:child_process";
import { parseArgs } from "node:util";

const execCommand = () => {
  const { positionals } = parseArgs({ allowPositionals: true });
  if (!positionals.length) {
    process.exit(1);
  }
  const [command, ...args] = positionals;
  const child = spawn(command, args, { stdio: "inherit" });
  child.on("close", (code) => process.exit(code ?? 0));
};

execCommand();
