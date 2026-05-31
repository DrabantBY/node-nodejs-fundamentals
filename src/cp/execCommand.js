import { spawn } from "node:child_process";

const execCommand = () => {
  const [command, ...args] = process.argv[2].split(/\s+/);
  const child = spawn(command, args, { stdio: "inherit" });
  child.on("close", process.exit);
};

execCommand();
