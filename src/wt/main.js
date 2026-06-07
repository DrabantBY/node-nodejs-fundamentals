import { readFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";
import { Worker } from "node:worker_threads";

const sortByHeap = (arr) => {
  const heap = [];

  const siftUp = (i) => {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);

      if (heap[parent][0] <= heap[i][0]) break;

      [heap[i], heap[parent]] = [heap[parent], heap[i]];

      i = parent;
    }
  };

  const siftDown = (i) => {
    const n = heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let min = i;

      if (l < n && heap[l][0] < heap[min][0]) {
        min = l;
      }

      if (r < n && heap[r][0] < heap[min][0]) {
        min = r;
      }

      if (min === i) break;

      [heap[i], heap[min]] = [heap[min], heap[i]];

      i = min;
    }
  };

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > 0) {
      heap.push([arr[i][0], i, 0]);
      siftUp(heap.length - 1);
    }
  }

  const total = arr.reduce((sum, el) => sum + el.length, 0);
  const result = new Array(total);
  let counter = 0;

  while (heap.length > 0) {
    const [value, arrIdx, elIdx] = heap[0];

    result[counter++] = value;

    const nextIdx = elIdx + 1;

    if (nextIdx < arr[arrIdx].length) {
      heap[0] = [arr[arrIdx][nextIdx], arrIdx, nextIdx];
      siftDown(0);
    } else {
      const last = heap.pop();

      if (heap.length > 0) {
        heap[0] = last;
        siftDown(0);
      }
    }
  }

  return result;
};

const createWorker = (path, workerData) => {
  const { promise, resolve } = Promise.withResolvers();
  const worker = new Worker(path, { workerData });
  worker.once("message", resolve);
  return promise;
};

const main = async () => {
  const data = await readFile(resolve("data.json"));

  const numbers = JSON.parse(data);

  const amount = Math.min(availableParallelism(), numbers.length);
  const quotient = Math.floor(numbers.length / amount);
  const remainder = numbers.length % amount;

  let counter = 0;

  const workers = [];

  for (let i = 0; i < amount; i++) {
    const size = quotient + (i < remainder ? 1 : 0);

    const chunk = [];

    for (let j = 0; j < size; j++) {
      chunk.push(numbers[counter++]);
    }

    workers.push(
      createWorker(resolve(import.meta.dirname, "worker.js"), chunk),
    );
  }

  const chunkList = await Promise.all(workers);

  console.log(sortByHeap(chunkList));
};

await main();
