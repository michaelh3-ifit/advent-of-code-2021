import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    let data: number[] = [];
    await processFile(inputFile, (line) => {
      data = line.split(",").map(Number);
    });
    data = data.sort((a, b) => a - b);
    const min = data[0];
    const max = data[data.length - 1];

    const fuelUsages: number[] = [];
    for (let i = min; i <= max; i++) {
      fuelUsages[i] = 0;
    }
    for (const num of data) {
      for (let i = min; i <= max; i++) {
        fuelUsages[i] += Math.abs(i - num);
      }
    }
    return fuelUsages.sort((a, b) => a - b)[0].toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    let data: number[] = [];
    await processFile(inputFile, (line) => {
      data = line.split(",").map(Number);
    });
    data = data.sort((a, b) => a - b);
    const min = data[0];
    const max = data[data.length - 1];

    const fuelUsages: number[] = [];
    for (let i = min; i <= max; i++) {
      fuelUsages[i] = 0;
    }
    for (const num of data) {
      for (let i = min; i <= max; i++) {
        const distance = Math.abs(i - num);
        const cost = ((1 + distance) * distance) / 2;
        fuelUsages[i] += cost;
      }
    }
    return fuelUsages.sort((a, b) => a - b)[0].toString();
  }
}
