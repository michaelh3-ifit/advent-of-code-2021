/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const result: number[] = [];
    await processFile(inputFile, (line) => {
      for (let i = 0; i < line.length; i++) {
        if (result[i] === undefined) {
          result[i] = 0;
        }
        result[i] += line[i] === "1" ? 1 : -1;
      }
    });
    let gammaRate = "";
    let epsilonRate = "";
    for (const num of result) {
      gammaRate += num > 0 ? "1" : "0";
      epsilonRate += num < 0 ? "1" : "0";
    }
    return (parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)).toString();
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const blank: INode = { One: null, Zero: null, Count: 0 };
    const tree: INode = { ...blank };
    await processFile(inputFile, (line) => {
      let curr = tree;
      curr.Count++;
      for (const num of line) {
        if (num === "0") {
          if (!curr.Zero) {
            curr.Zero = { ...blank };
          }
          curr.Zero.Count++;
          curr = curr.Zero;
        } else {
          if (!curr.One) {
            curr.One = { ...blank };
          }
          curr.One.Count++;
          curr = curr.One;
        }
      }
      curr.Value = parseInt(line, 2);
    });

    let curr = tree;
    while (curr.One !== null || curr.Zero !== null) {
      if (curr.One === null || curr.Zero === null) {
        curr = curr.One! || curr.Zero!;
      } else {
        curr = curr.One.Count >= curr.Zero.Count ? curr.One : curr.Zero;
      }
    }
    if (curr.Value === undefined) {
      throw "ox value undefined!";
    }
    const ox = curr.Value;
    curr = tree;
    while (curr.One !== null || curr.Zero !== null) {
      if (curr.One === null || curr.Zero === null) {
        curr = curr.One! || curr.Zero!;
      } else {
        curr = curr.Zero.Count <= curr.One.Count ? curr.Zero : curr.One;
      }
    }
    if (curr.Value === undefined) {
      throw "co2 value undefined!";
    }
    const co2 = curr.Value;

    return (ox * co2).toString();
  }
}

interface INode {
  One: INode | null;
  Zero: INode | null;
  Count: number;
  Value?: number;
}
