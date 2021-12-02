/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    let prev = Number.MAX_VALUE;
    let count = 0;
    await processFile(inputFile, (line) => {
      if (Number(line) > prev) {
        count++;
      }
      prev = Number(line);
    });

    return count.toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, (line) => {
      data.push(Number(line));
    });

    let count = 0;
    for (let i = 3; i < data.length; i++) {
      if (data[i] > data[i - 3]) {
        count++;
      }
    }
    return count.toString();
  }
}
