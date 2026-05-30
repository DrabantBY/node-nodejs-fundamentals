import { spawn } from "node:child_process";

const execCommand = () => {
  const [command, ...args] = process.argv[2].split(" ");
  const child = spawn(command, args);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on("close", process.exit);
};

execCommand();
