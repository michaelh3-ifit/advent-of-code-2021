import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    return this.internalGetSolution(inputFile, 80);
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    return this.internalGetSolution(inputFile, 256);
  }
  private async internalGetSolution(
    inputFile: string,
    targetGenerations: number
  ): Promise<string> {
    let data: number[] = [];
    await processFile(inputFile, (line) => {
      data = line.split(",").map(Number);
    });
    const maxAge = 8;
    const ages: { [num: number]: number } = {};
    for (let a = 0; a <= maxAge; a++) {
      ages[a] = 0;
    }
    for (const f of data) {
      ages[f]++;
    }
    for (let g = 0; g < targetGenerations; g++) {
      const ageZero = ages[0];
      for (let a = 1; a <= 8; a++) {
        ages[a - 1] = ages[a];
      }
      ages[6] += ageZero;
      ages[8] = ageZero;
    }
    return Object.values(ages)
      .reduce((acc, val) => acc + val, 0)
      .toString();
  }
}
