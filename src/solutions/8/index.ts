import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: number[] = [];
    await processFile(inputFile, (line) => {
      data.push(
        line
          .split(" | ")[1]
          .split(" ")
          .map((s) => s.length)
          .filter((l) => [2, 3, 4, 7].includes(l)).length
      );
    });
    return data.reduce((prev, curr) => prev + curr, 0).toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: { pattern: string; output: string }[] = [];
    await processFile(inputFile, (line) => {
      const lineSplit = line.split(" | ");
      data.push({ pattern: lineSplit[0], output: lineSplit[1] });
    });

    let total = 0;
    for (const entry of data) {
      const map = this.deduceNumbers(entry.pattern.split(" "));
      const outputNumber = entry.output
        .split(" ")
        .map(this.convertToBitFlag)
        .reduce((acc, curr) => acc + map[curr].toString(), "");
      total += parseInt(outputNumber);
    }
    return total.toString();
  }

  convertToBitFlag(pattern: string): number {
    const letterToFlagMap: { [letter: string]: number } = {
      a: 1 << 0,
      b: 1 << 1,
      c: 1 << 2,
      d: 1 << 3,
      e: 1 << 4,
      f: 1 << 5,
      g: 1 << 6,
    };
    let result = 0;
    for (const c of pattern.split("")) {
      result |= letterToFlagMap[c];
    }
    return result;
  }

  deduceNumbers(patterns: string[]): { [flag: number]: number } {
    const numberFlagMap: { [flag: number]: number } = {};
    const numberMap: string[] = new Array(10);

    // Easy ones first
    numberMap[1] = patterns.findAndRemove((pattern) => pattern.length === 2);
    numberMap[4] = patterns.findAndRemove((pattern) => pattern.length === 4);
    numberMap[7] = patterns.findAndRemove((pattern) => pattern.length === 3);
    numberMap[8] = patterns.findAndRemove((pattern) => pattern.length === 7);

    // Is length 5 and contains same characters as 1
    numberMap[3] = patterns.findAndRemove(
      (pattern) =>
        pattern.length === 5 &&
        pattern.includes(numberMap[1][0]) &&
        pattern.includes(numberMap[1][1])
    );

    // Is length 6 and doesn't contain same characters as 1
    numberMap[6] = patterns.findAndRemove(
      (pattern) =>
        pattern.length === 6 &&
        (!pattern.includes(numberMap[1][0]) ||
          !pattern.includes(numberMap[1][1]))
    );

    // Find what letter segment C is by finding the difference between 8 and 6
    const segmentC = numberMap[8]
      .split("")
      .find((c) => !numberMap[6].includes(c));

    // Is length 5 and contains segment C
    numberMap[2] = patterns.findAndRemove(
      (pattern) => pattern.length === 5 && pattern.includes(segmentC!)
    );

    // Is the only remaining length 5
    numberMap[5] = patterns.findAndRemove((pattern) => pattern.length === 5);

    // Is length 6 and contains same characters as 5
    numberMap[9] = patterns.findAndRemove(
      (pattern) =>
        pattern.length === 6 &&
        !numberMap[5].split("").find((c) => !pattern.includes(c))
    );

    // Is the only entry left
    numberMap[0] = patterns[0];

    for (let i = 0; i < 10; i++) {
      numberFlagMap[this.convertToBitFlag(numberMap[i])] = i;
    }
    return numberFlagMap;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Array<T> {
    findAndRemove(predicate: (value: T) => boolean): T;
  }
}
if (!Array.prototype.findAndRemove) {
  Object.defineProperty(Array.prototype, "findAndRemove", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function findAndRemove<T>(
      predicate: (value: T) => boolean
    ): T | undefined {
      const i = (this as Array<T>).findIndex(predicate);
      if (i === -1) {
        return undefined;
      }
      return (this as Array<T>).splice(i, 1)[0];
    },
  });
}
