import { parentPort, workerData } from "node:worker_threads";

parentPort.postMessage(
  Array.isArray(workerData) ? workerData.toSorted((a, b) => a - b) : [],
);
